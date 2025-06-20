import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const response = NextResponse.json(
      { message: 'Déconnexion réussie' },
      { status: 200 }
    );
    
    // Supprimer le cookie d'authentification
    response.cookies.set('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: new Date(0),
      path: '/',
    });
    
    return response;
  } catch (error) {
    return NextResponse.json(
      { message: 'Erreur lors de la déconnexion' },
      { status: 500 }
    );
  }
}