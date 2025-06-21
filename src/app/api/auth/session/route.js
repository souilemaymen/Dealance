import dbConnect from "@/app/api/lib/dbConnect";
import User from "@/app/api/models/User";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// GET: Récupérer la session utilisateur
export async function GET(req) {
  try {
    console.log("Session request received");
    await dbConnect();
    
    // Récupérer le token du cookie
    const token = req.cookies.get("token")?.value;
    console.log("Token:", token);
    
    if (!token) {
      console.log("No token found");
      return NextResponse.json(
        { message: "Non authentifié" },
        { status: 401 }
      );
    }

    // Vérifier le token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Token decoded successfully");
      console.log("User ID from token:", decoded.userId);
    } catch (verifyError) {
      console.error("Token verification failed:", verifyError);
      throw verifyError;
    }
    
    const userId = decoded.userId;
    console.log("Fetching user from DB with ID:", userId);

    // Récupérer les données utilisateur
    const user = await User.findById(userId).select("-password");
    if (!user) {
      console.log("User not found in database");
      return NextResponse.json(
        { message: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    console.log("User found:", {
      id: user._id,
      name: user.fullName,
      email: user.email
    });

    return NextResponse.json({ 
      userId: user._id,
      fullName: user.fullName,
      profileImage: user.profileImage,
      email: user.email
    }, { status: 200 });
    
  } catch (error) {
    console.error("Erreur de session:", error);
    
    // Supprimer le cookie invalide
    if (error.name === "JsonWebTokenError") {
      console.log("Invalid JWT token - deleting cookie");
      const response = NextResponse.json(
        { message: "Session invalide" },
        { status: 401 }
      );
      response.cookies.delete("token");
      return response;
    }
    
    return NextResponse.json(
      { message: "Erreur serveur" },
      { status: 500 }
    );
  }
}

// POST: Déconnexion
export async function POST() {
  try {
    console.log("Logout request received");
    const response = NextResponse.json(
      { message: "Déconnexion réussie" },
      { status: 200 }
    );
    
    // Supprimer le cookie
    response.cookies.set("token", "", {
      httpOnly: true,
      expires: new Date(0),
      path: "/",
    });
    
    console.log("Cookie deleted successfully");
    return response;
  } catch (error) {
    console.error("Erreur de déconnexion:", error);
    return NextResponse.json(
      { message: "Erreur serveur" },
      { status: 500 }
    );
  }
}