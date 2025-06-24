import dbConnect from "@/app/api/lib/dbConnect";
import User from "@/app/api/models/User";
import Subscription from "@/app/api/models/Subscription"; // Import du modèle Subscription
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    await dbConnect();
    const { fullName, email, phoneNumber, password } = await req.json();

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ $or: [{ email }, { phoneNumber }] });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email ou numéro de téléphone déjà utilisé" },
        { status: 400 }
      );
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer un nouvel utilisateur
    const newUser = new User({
      fullName,
      email,
      phoneNumber,
      password: hashedPassword,
    });

    await newUser.save();

    
    const newSubscription = new Subscription({
      userId: newUser._id, 
      fullName: newUser.fullName, 
      subscriptionType: "Null", 
    });
    await newSubscription.save();

    // Créer le token JWT
    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Créer la réponse avec cookie HTTP-only
    const response = NextResponse.json(
      { 
        message: "Inscription réussie", 
        userId: newUser._id,
        subscriptionId: newSubscription._id // Optionnel: on renvoie l'ID de l'abonnement
      },
      { status: 201 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 86400, // 1 jour
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Erreur d'inscription:", error);
    return NextResponse.json(
      { message: "Erreur serveur" },
      { status: 500 }
    );
  }
}