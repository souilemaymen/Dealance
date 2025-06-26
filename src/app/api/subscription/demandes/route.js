import dbConnect from "@/app/api/lib/dbConnect";
import mongoose from "mongoose";
import User from "@/app/api/models/User";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server"; // Utilisez NextResponse pour la cohérence

export async function POST(req) {
  try {
    await dbConnect();
    const db = mongoose.connection.db;

    // Récupérer les données de la requête
    const data = await req.json();
    
    // Vérifier que userId est présent
    if (!data.userId) {
      return NextResponse.json(
        { error: "ID utilisateur manquant" },
        { status: 400 }
      );
    }

    // Validation du type d'abonnement
    const validTypes = ["Basique", "Pro", "Elite"];
    if (!validTypes.includes(data.subscriptionType)) {
      return NextResponse.json(
        { error: "Type d'abonnement invalide. Options: Basique, Pro, Elite" },
        { status: 400 }
      );
    }
    
    // Récupération des informations utilisateur
    const user = await User.findById(data.userId);
    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }
    
    // Création du document de demande
    const demandeData = {
      userId: data.userId,
      fullName: user.fullName,
      phoneNumber: user.phoneNumber,
      subscriptionType: data.subscriptionType,
      status: "En attente",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Insertion dans MongoDB
    const result = await db.collection("demandes").insertOne(demandeData);
    
    return NextResponse.json({
      success: true,
      message: "Demande d'abonnement créée avec succès",
      demandeId: result.insertedId
    }, { status: 201 });
    
  } catch (error) {
    console.error("Erreur création demande:", error);
    return NextResponse.json({
      error: "Erreur serveur",
      details: error.message
    }, { status: 500 });
  }
}
export async function GET() {
  return new Response(JSON.stringify({
    error: "Méthode non autorisée. Utilisez POST pour créer une demande."
  }), {
    status: 405,
    headers: { "Content-Type": "application/json" },
  });
}