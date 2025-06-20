import dbConnect from '../lib/dbConnect';
import Publication from '../models/Publication';
import { NextResponse } from "next/server";
import path from 'path';
import fs from 'fs/promises';
import jwt from 'jsonwebtoken';
import mongoose from "mongoose";
export const dynamic = 'force-dynamic';

// Fonction GET pour récupérer les publications
export async function GET() {
  await dbConnect();

  try {
    const publications = await Publication.find()
      .sort({ createdAt: -1 })
      .populate('userId', 'fullName userType profileImage');
    
    // Toujours retourner un tableau même si vide
    return NextResponse.json(publications || []);
  } catch (error) {
    console.error('Erreur GET publications:', error);
    
    // En cas d'erreur, retourner un tableau vide
    return NextResponse.json([], { status: 200 });
  }
}
export async function POST(request) {
  await dbConnect();
  
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const cookies = {};
    
    cookieHeader.split(';').forEach(cookie => {
      const parts = cookie.split('=');
      if (parts.length === 2) {
        cookies[parts[0].trim()] = parts[1].trim();
      }
    });

    const token = cookies.token;

    if (!token) {
      return NextResponse.json(
        { error: 'Veuillez vous connecter pour publier' },
        { status: 401 }
      );
    }
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Token décodé:", decoded); 
      if (!decoded.userId || !mongoose.Types.ObjectId.isValid(decoded.userId)) {
        throw new Error('Token utilisateur invalide');
      }
    } catch (jwtError) {
      console.error('Erreur JWT:', jwtError);
      return NextResponse.json(
        { error: 'Session invalide ou expirée' },
        { status: 401 }
      );
    }

    //const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    const userType = decoded.userType || 'freelancer';

    const formData = await request.formData();
    
    const content = formData.get('content');
    const budget = formData.get('budget');
    const tags = JSON.parse(formData.get('tags') || '[]'); // Ajout d'une valeur par défaut
    const mediaFile = formData.get('media');
    
    let mediaPath = null;
    if (mediaFile && mediaFile.name) {
      const fileName = `${Date.now()}-${mediaFile.name}`;
      const filePath = path.join(process.cwd(), 'public', 'uploads', fileName);
      
      const buffer = Buffer.from(await mediaFile.arrayBuffer());
      await fs.writeFile(filePath, buffer);
      
      mediaPath = `/uploads/${fileName}`;
    }

    const newPublication = new Publication({
      content,
      tags,
      budget,
      media: mediaPath,
      userId,
      userType,
      fullName: decoded.fullName 
    });

    await newPublication.save();
    return NextResponse.json(newPublication, { status: 201 });
  } catch (error) {
    console.error('Erreur création publication:', error);
    return NextResponse.json(
      { error: 'Erreur création publication: ' + error.message },
      { status: 500 }
    );
  }
}