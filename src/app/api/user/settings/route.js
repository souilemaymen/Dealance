import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from "@/app/api/lib/dbConnect";
import User from "@/app/api/models/User";


// GET: Récupérer les données utilisateur
export async function GET(request) {
  await dbConnect();
  
  try {
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      userType: user.userType,
      linkedin: user.linkedin,
      github: user.github,
      portfolio: user.portfolio,
      otherLink: user.otherLink
    });
  } catch (error) {
    console.error('Erreur récupération données utilisateur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// PATCH: Mettre à jour les données utilisateur
export async function PATCH(request) {
  await dbConnect();
  
  try {
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    
    const updateData = await request.json();
    
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedUser) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Profil mis à jour avec succès' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur mise à jour utilisateur:', error);
    
    // Gestion spécifique des erreurs MongoDB
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { error: 'Erreur de validation', details: errors },
        { status: 400 }
      );
    }
    
    if (error.name === 'MongoServerError' && error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return NextResponse.json(
        { error: `${field} existe déjà` },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}