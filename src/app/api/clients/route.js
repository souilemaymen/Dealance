import dbConnect from '../lib/dbConnect';
import User from '../models/User';

export const GET = async (request) => {
  try {
    await dbConnect();
    
    // Récupérer les paramètres de requête
    const { searchParams } = new URL(request.url);
    const userType = searchParams.get('userType') || 'client';
    
    // Définir les types d'utilisateurs valides
    const validUserTypes = ['freelancer', 'client'];
    
    if (!validUserTypes.includes(userType)) {
      return new Response(JSON.stringify({ 
        error: 'Type d\'utilisateur invalide. Types valides: "freelancer" ou "client'
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Récupérer les utilisateurs selon le type
    const clients = await User.find({ userType })
      .select('-password -__v') // Exclure les champs sensibles
      .sort({ createdAt: -1 }); // Trier par date de création décroissante

    return new Response(JSON.stringify(clients), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error("Erreur lors de la récupération des clients:", error);
    return new Response(JSON.stringify({ 
      error: 'Erreur serveur lors de la récupération des clients' 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};