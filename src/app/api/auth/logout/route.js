import { NextResponse } from "next/server";

export async function POST() {
  try {
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
    
    return response;
  } catch (error) {
    console.error("Erreur de déconnexion:", error);
    return NextResponse.json(
      { message: "Erreur serveur" },
      { status: 500 }
    );
  }
}