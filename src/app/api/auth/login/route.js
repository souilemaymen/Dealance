import { NextResponse } from "next/server";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Connexion à MongoDB
const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
  }
};

// User Schema (même que pour signup)
const UserSchema = new mongoose.Schema({
  fullName: String,
  email: { type: String, unique: true },
  password: String,
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export async function POST(req) {
  await connectDB();

  const { email, password } = await req.json();
  // Validation simple
  if (!email || !password) {
    return NextResponse.json(
      { message: "Please provide email and password." },
      { status: 400 }
    );
  }

  // Trouver l'utilisateur par email
  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json(
      { message: "User not found." },
      { status: 404 }
    );
  }

  // Vérifier le mot de passe
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return NextResponse.json(
      { message: "Invalid credentials." },
      { status: 401 }
    );
  }

  // Générer un token JWT
  const payload = {
    userId: user._id,
    email: user.email,
    userType: user.userType
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
  
  // Répondre avec le token
  const response = NextResponse.json(
    {
      message: "Login successful",
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
         userType: user.userType
      }
    },
    { status: 200 }
  );

  // Définir le cookie sécurisé
  response.cookies.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", // ou lax 
    maxAge: 30 * 24 * 60 * 60, // 30 jours
    path: "/",
  });

  return response;
}
