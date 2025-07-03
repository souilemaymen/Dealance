// app/api/profil/[userId]/route.js
// app/api/profil/[userId]/route.js
import dbConnect from "@/app/api/lib/dbConnect";
import User from "@/app/api/models/User";
import jwt from "jsonwebtoken";

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    // Extraire le userId de l'URL de manière asynchrone
    const url = new URL(request.url);
    const pathSegments = url.pathname.split('/');
    const userId = pathSegments[pathSegments.length - 1];
    
    // Récupérer le token du cookie de la requête
    const token = request.cookies.get("token")?.value;
    
    let currentUserId = null;
    
    // Vérifier le token si présent
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        currentUserId = decoded.userId;
      } catch (error) {
        console.error("Token verification error:", error);
        // On continue sans lever d'erreur car l'utilisateur peut être non connecté
      }
    }

    await dbConnect();

    // Récupérer l'utilisateur par son ID
    const user = await User.findById(userId)
      .select("-password -__v -createdAt -updatedAt -emailVerified");
    
    if (!user) {
      return new Response(JSON.stringify({ error: "Utilisateur non trouvé" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Créer la réponse avec tous les champs nécessaires
    const responseData = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      bio: user.bio,
      category: user.category,
      companyName: user.companyName,
      customCategory: user.customCategory,
      experience: user.experience,
      github: user.github,
      linkedin: user.linkedin,
      otherLink: user.otherLink,
      portfolio: user.portfolio,
      professionalTitle: user.professionalTitle,
      profileImage: user.profileImage,
      projectBudget: user.projectBudget,
      projectDescription: user.projectDescription,
      technologies: user.technologies,
      userType: user.userType,
      subscriptionType: user.subscriptionType || "Null",
      isPublicProfile: user.isPublicProfile || true,
      socialLinks: {
        github: user.github,
        linkedin: user.linkedin,
        portfolio: user.portfolio,
        other: user.otherLink
      }
    };

    // Filtrer les données sensibles si l'utilisateur n'est pas le propriétaire
    const isOwner = currentUserId === userId;
    if (!isOwner) {
      delete responseData.email;
      delete responseData.phoneNumber;
    }

    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Erreur:", error);
    return new Response(JSON.stringify({ error: "Erreur serveur" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}