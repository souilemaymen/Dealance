// app/api/report/route.js
import dbConnect from "@/app/api/lib/dbConnect";
import mongoose from "mongoose";
import { ObjectId } from 'mongodb';

// Création du schéma et modèle pour les signalements
const reportSchema = new mongoose.Schema({
  reportedUserId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  reporterUserId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  reason: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['non traité', 'traité'],
    default: 'non traité'
  }
});

// Vérifie si le modèle existe déjà avant de le créer
const Report = mongoose.models.Report || mongoose.model('Report', reportSchema);

export async function POST(request) {
  try {
    await dbConnect();
    
    const { reportedUserId, reporterUserId, reason } = await request.json();
    
    // Validation des données
 if (!reportedUserId || !reporterUserId || !reason) {
      return new Response(JSON.stringify({
        error: "Tous les champs sont requis"
      }), { status: 400 });
    }

    // Création du nouveau signalement
    const newReport = new Report({
      reportedUserId: new ObjectId(reportedUserId),
      reporterUserId: new ObjectId(reporterUserId),
      reason
    });

    const savedReport = await newReport.save();

    return new Response(JSON.stringify({
      message: "Signalement enregistré avec succès",
      reportId: savedReport._id
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error("Erreur lors de l'enregistrement du signalement:", error);
    return new Response(JSON.stringify({
      error: error.message || "Une erreur s'est produite lors du traitement du signalement"
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}