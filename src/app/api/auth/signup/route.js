// app/api/auth/signup/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/app/api/lib/dbConnect';
import User from '@/app/api/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req) {
  try {
    const { fullName, email, phoneNumber, password } = await req.json();
    console.log("Données reçues:", { fullName, email, phoneNumber }); // Log pour débogage
    await dbConnect();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      fullName,
      email,
      phoneNumber,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    const response = NextResponse.json({
      user: {
        userId: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        phoneNumber: newUser.phoneNumber,
      },
    });

    // Définir le cookie sécurisé
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60, 
      path: "/",
    });
  return response;
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
