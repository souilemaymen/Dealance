// app/api/auth/forgot-password/route.js
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import dbConnect from "@/app/api/lib/dbConnect";
import User from "@/app/api/models/User";

// Configuration du transporteur email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(request) {
  await dbConnect();
  
  try {
    const { email } = await request.json();
    
    // Trouver l'utilisateur par email
    const user = await User.findOne({ email });
    
    if (!user) {
      return NextResponse.json(
        { error: "Aucun compte associé à cet email" },
        { status: 404 }
      );
    }

    // Générer un token de réinitialisation
    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 heure
    
    // Mettre à jour l'utilisateur avec le token
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiry;
    await user.save();

    // Créer le lien de réinitialisation
    const resetUrl = `${process.env.BASE_URL}/reset-password?token=${resetToken}`;

    // Envoyer l'email
    const mailOptions = {
      to: user.email,
      from: `Dealance <${process.env.EMAIL_USER}>`,
      subject: 'Réinitialisation de votre mot de passe',
      text: `Vous avez demandé la réinitialisation de votre mot de passe. 
             Cliquez sur ce lien pour procéder : ${resetUrl}
             
             Si vous n'avez pas fait cette demande, ignorez simplement cet email.`,
      html: `<p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
             <p>Cliquez sur ce lien pour procéder : <a href="${resetUrl}">${resetUrl}</a></p>
             <p>Si vous n'avez pas fait cette demande, ignorez simplement cet email.</p>`
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: "Un email de réinitialisation a été envoyé" },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Erreur réinitialisation mot de passe:', error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}