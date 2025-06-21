import dbConnect from "@/app/api/lib/dbConnect"; // Chemin corrigé
import User from "@/app/api/models/User"; 
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import mongoose from "mongoose"; // Import mongoose pour valider les ObjectId

// GET: Récupérer les infos utilisateur
export async function GET(req) {
  try {
    await dbConnect();
    
    // Récupérer le token
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { message: "Non autorisé" },
        { status: 401 }
      );
    }
    
    // Vérifier le token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      console.error("Token verification failed:", error);
      const response = NextResponse.json(
        { message: "Token invalide ou expiré" },
        { status: 401 }
      );
      response.cookies.delete("token");
      return response;
    }
    
    const userId = decoded.userId;
    
    // Validation de l'ID utilisateur
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { message: "Format d'ID utilisateur invalide" },
        { status: 400 }
      );
    }
    
    // Récupérer l'utilisateur
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return NextResponse.json(
        { message: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Erreur GET user:", error);
    return NextResponse.json(
      { 
        message: "Erreur serveur",
        error: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

// PATCH: Mettre à jour les infos utilisateur
export async function PATCH(req) {
  try {
    await dbConnect();
    
    // Récupérer le token
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { message: "Non autorisé" },
        { status: 401 }
      );
    }
    
    // Vérifier le token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      console.error("Token verification failed:", error);
      const response = NextResponse.json(
        { message: "Token invalide ou expiré" },
        { status: 401 }
      );
      response.cookies.delete("token");
      return response;
    }
    
    const userId = decoded.userId;
    
    // Validation de l'ID utilisateur
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { message: "Format d'ID utilisateur invalide" },
        { status: 400 }
      );
    }
    
    // Récupérer les données
    const data = await req.json();
    
    // Mettre à jour l'utilisateur
    const updatedUser = await User.findByIdAndUpdate(
      userId, 
      data, 
      { new: true }
    ).select("-password");
    
    if (!updatedUser) {
      return NextResponse.json(
        { message: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { 
        message: "Profil mis à jour", 
        user: updatedUser 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur PATCH user:", error);
    return NextResponse.json(
      { 
        message: "Erreur serveur",
        error: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}