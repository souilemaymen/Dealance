// app/profil/[userId]/page.jsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Badge from "@/components/Badge";
import ReportModal from "@/components/ReportModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faEnvelope, 
  faPhone, 
  faGlobe, 
  faLocationDot,
  faLock,
  faEdit,
  faBriefcase,
  faLaptopCode,
  faUserTie,
  faCode,
  faCalendarAlt,
  faTools,
  faStar,
  faLink,
  faUserShield
} from "@fortawesome/free-solid-svg-icons";
import { 
  faGithub, 
  faLinkedin,
  faDribbble
} from "@fortawesome/free-brands-svg-icons";

export default function UserProfilePage() {
  const { userId } = useParams();
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isOwner, setIsOwner] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const router = useRouter();
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/profil/${userId}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Erreur lors du chargement du profil");
        }
        
        const data = await response.json();
        setUserData(data);
        setIsOwner(session?.user?.id === data._id);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchUserProfile();
  }, [userId, session]);

  useEffect(() => {
    // Récupérer l'ID utilisateur depuis le token
    const getUserIdFromToken = async () => {
      try {
        const response = await fetch('/api/auth/session');
        const sessionData = await response.json();
        if (sessionData.userId) {
          setCurrentUserId(sessionData.userId);
        }
      } catch (err) {
        console.error("Erreur de récupération de session", err);
      }
    };

    if (status === "authenticated" && session?.user?.id) {
      setCurrentUserId(session.user.id);
    } else {
      getUserIdFromToken();
    }
  }, [status, session]);

  const handleReportSubmit = async (reason) => {
    try {
      // Utiliser currentUserId au lieu de session.user.id
      if (!currentUserId) {
        throw new Error("Votre session a expiré. Veuillez vous reconnecter.");
      }
      
      if (!userId) {
        throw new Error("ID utilisateur manquant");
      }

      const response = await fetch('/api/report', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          reportedUserId: userId,
          reporterUserId: currentUserId, // Ici
          reason
        })
      });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Erreur lors de l'envoi du signalement");
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
};

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600 mb-6"></div>
        <p className="font-dosis text-gray-600 dark:text-gray-300 text-lg">Chargement du profil...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 max-w-md text-center border border-gray-200 dark:border-gray-700">
          <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-6">
            <FontAwesomeIcon icon={faStar} className="h-8 w-8 text-red-500 dark:text-red-400" />
          </div>
          <h2 className="text-2xl font-dosis font-bold text-gray-800 dark:text-white mb-4">Oups !</h2>
          <p className="font-geist-sans text-gray-600 dark:text-gray-300 mb-6">{error}</p>
          <button 
            onClick={() => router.push("/Acceuil")}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:opacity-90 transition-all duration-300 font-geist-sans shadow-lg hover:shadow-purple-500/20"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* En-tête du profil */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden mb-10 border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-2xl">
          <div className="relative">
            {/* Bannière avec dégradé animé */}
            <div className="h-48 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-gradient-x"></div>
            
            {/* Photo de profil et informations */}
            <div className="flex flex-col md:flex-row px-6 pb-8 -mt-20">
              <div className="flex-shrink-0 relative z-10 transform hover:scale-105 transition-transform duration-300">
                <Badge subscriptionType={userData.subscriptionType}>
                  <div className="bg-white dark:bg-gray-800 border-4 border-white dark:border-gray-800 rounded-full p-1 w-44 h-44 shadow-xl">
                    {userData.profileImage ? (
                      <img 
                        src={userData.profileImage} 
                        alt="Profile" 
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <div className="bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full w-full h-full flex items-center justify-center">
                        <span className="text-6xl text-gray-400 dark:text-gray-300 font-dosis font-bold">
                          {userData.fullName ? userData.fullName.charAt(0) : 'U'}
                        </span>
                      </div>
                    )}
                  </div>
                </Badge>
              </div>
              
              <div className="mt-6 md:mt-0 md:ml-6 flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h1 className="text-4xl font-dosis font-bold text-gray-800 dark:text-white">
                      {userData.fullName || "Utilisateur inconnu"}
                    </h1>
                    
                    {userData.professionalTitle && (
                      <p className="font-geist-sans text-indigo-600 dark:text-indigo-400 font-medium mt-2 text-lg">
                        {userData.professionalTitle}
                      </p>
                    )}
                    
                    {userData.category && (
                      <p className="font-geist-sans text-gray-600 dark:text-gray-300 mt-3 flex items-center text-lg">
                        <FontAwesomeIcon icon={faLaptopCode} className="h-5 w-5 mr-2 text-indigo-500" />
                        {userData.category}
                      </p>
                    )}
                  </div>
                  
                  <div className="mt-6 md:mt-0 flex space-x-3">
                    {isOwner && (
                      <Link 
                        href="/parametres" 
                        className="flex items-center px-5 py-3 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-gray-700 dark:to-gray-600 text-gray-800 dark:text-gray-200 rounded-xl hover:opacity-90 transition-all duration-300 font-geist-sans shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transform hover:-translate-y-1"
                      >
                        <FontAwesomeIcon icon={faEdit} className="h-4 w-4 mr-2" />
                        Modifier
                      </Link>
                    )}
                    
                    {!isOwner && currentUserId && ( // ← Vérification en chaîne ajoutée
                        <button onClick={() => setShowReportModal(true)}>
                        <FontAwesomeIcon icon={faUserShield} className="h-4 w-4 mr-2" />
                        Signaler
                        </button>
                    )}
                  </div>
                </div>
                
                <div className="mt-6 flex flex-wrap gap-4">
                  {userData.companyName && (
                    <div className="flex items-center text-gray-600 dark:text-gray-300 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                      <FontAwesomeIcon icon={faBriefcase} className="h-4 w-4 mr-2 text-indigo-500" />
                      <span className="font-geist-sans text-sm font-medium">{userData.companyName}</span>
                    </div>
                  )}
                  
                  {userData.userType && (
                    <div className="flex items-center text-gray-600 dark:text-gray-300 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                      <FontAwesomeIcon icon={faUserTie} className="h-4 w-4 mr-2 text-indigo-500" />
                      <span className="font-geist-sans text-sm font-medium capitalize">{userData.userType}</span>
                    </div>
                  )}
                  
                  {userData.location && (
                    <div className="flex items-center text-gray-600 dark:text-gray-300 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                      <FontAwesomeIcon icon={faLocationDot} className="h-4 w-4 mr-2 text-indigo-500" />
                      <span className="font-geist-sans text-sm font-medium">{userData.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Section À propos */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 mb-10 border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-2xl">
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center mr-4">
              <FontAwesomeIcon icon={faUserTie} className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="text-2xl font-dosis font-bold text-gray-800 dark:text-white">
              À propos
            </h2>
          </div>
          
          {userData.bio ? (
            <p className="font-geist-sans text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
              {userData.bio}
            </p>
          ) : (
            <p className="font-geist-sans text-gray-500 dark:text-gray-400 italic text-lg">
              Cet utilisateur n'a pas encore rédigé de bio.
            </p>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
            {userData.experience && (
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-300 hover:shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mr-3">
                    <FontAwesomeIcon icon={faCalendarAlt} className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="font-dosis font-bold text-xl text-gray-800 dark:text-white">
                    Expérience
                  </h3>
                </div>
                <p className="font-geist-sans text-gray-700 dark:text-gray-300 text-lg">
                  {userData.experience}
                </p>
              </div>
            )}
            
            {userData.technologies && (
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-300 hover:shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mr-3">
                    <FontAwesomeIcon icon={faTools} className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="font-dosis font-bold text-xl text-gray-800 dark:text-white">
                    Technologies
                  </h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {userData.technologies.split(',').map((tech, index) => (
                    <span 
                      key={index} 
                      className="px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-geist-sans font-medium shadow-sm"
                    >
                      {tech.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {userData.projectDescription && (
            <div className="mt-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-300 hover:shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mr-3">
                  <FontAwesomeIcon icon={faLaptopCode} className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="font-dosis font-bold text-xl text-gray-800 dark:text-white">
                  Description du projet
                </h3>
              </div>
              <p className="font-geist-sans text-gray-700 dark:text-gray-300 text-lg">
                {userData.projectDescription}
              </p>
            </div>
          )}
          
          {userData.projectBudget && (
            <div className="mt-8 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20 p-6 rounded-2xl border border-indigo-200 dark:border-indigo-800 shadow-md">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-200/50 dark:bg-indigo-900/30 flex items-center justify-center mr-3">
                  <FontAwesomeIcon icon={faStar} className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="font-dosis font-bold text-xl text-indigo-700 dark:text-indigo-300">
                  Budget du projet
                </h3>
              </div>
              <p className="font-geist-sans text-indigo-600 dark:text-indigo-400 font-medium text-xl">
                {userData.projectBudget}
              </p>
            </div>
          )}
        </div>
        
        {/* Informations de contact */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 mb-10 border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-2xl">
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center mr-4">
              <FontAwesomeIcon icon={faEnvelope} className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="text-2xl font-dosis font-bold text-gray-800 dark:text-white">
              Contact
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {userData.email && (
              <div className="flex items-center p-5 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="w-14 h-14 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center flex-shrink-0">
                  <FontAwesomeIcon icon={faEnvelope} className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="ml-5">
                  <h3 className="font-dosis font-medium text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wider">Email</h3>
                  <p className="font-geist-sans text-gray-800 dark:text-gray-100 text-lg font-medium">{userData.email}</p>
                </div>
              </div>
            )}
            
            {userData.phoneNumber && (
              <div className="flex items-center p-5 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="w-14 h-14 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center flex-shrink-0">
                  <FontAwesomeIcon icon={faPhone} className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="ml-5">
                  <h3 className="font-dosis font-medium text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wider">Téléphone</h3>
                  <p className="font-geist-sans text-gray-800 dark:text-gray-100 text-lg font-medium">{userData.phoneNumber}</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Liens et portfolio */}
        {(userData.github || userData.linkedin || userData.portfolio || userData.otherLink) && (
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 mb-10 border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-2xl">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center mr-4">
                <FontAwesomeIcon icon={faLink} className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h2 className="text-2xl font-dosis font-bold text-gray-800 dark:text-white">
                Liens & Portfolio
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userData.github && (
                <a 
                  href={userData.github} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center p-5 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group"
                >
                  <div className="w-14 h-14 rounded-xl bg-gray-900 flex items-center justify-center flex-shrink-0">
                    <FontAwesomeIcon icon={faGithub} className="h-7 w-7 text-white" />
                  </div>
                  <div className="ml-5">
                    <h3 className="font-dosis font-medium text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wider">GitHub</h3>
                    <p className="font-geist-sans text-gray-800 dark:text-gray-100 text-lg font-medium group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                      {userData.github.replace(/^https?:\/\//, '')}
                    </p>
                  </div>
                </a>
              )}
              
              {userData.linkedin && (
                <a 
                  href={userData.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center p-5 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group"
                >
                  <div className="w-14 h-14 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
                    <FontAwesomeIcon icon={faLinkedin} className="h-7 w-7 text-white" />
                  </div>
                  <div className="ml-5">
                    <h3 className="font-dosis font-medium text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wider">LinkedIn</h3>
                    <p className="font-geist-sans text-gray-800 dark:text-gray-100 text-lg font-medium group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                      {userData.linkedin.replace(/^https?:\/\//, '')}
                    </p>
                  </div>
                </a>
              )}
              
              {userData.portfolio && (
                <a 
                  href={userData.portfolio} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center p-5 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group"
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                    <FontAwesomeIcon icon={faGlobe} className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-5">
                    <h3 className="font-dosis font-medium text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wider">Portfolio</h3>
                    <p className="font-geist-sans text-gray-800 dark:text-gray-100 text-lg font-medium group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                      {userData.portfolio.replace(/^https?:\/\//, '')}
                    </p>
                  </div>
                </a>
              )}
              
              {userData.otherLink && (
                <a 
                  href={userData.otherLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center p-5 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group"
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                    <FontAwesomeIcon icon={faDribbble} className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-5">
                    <h3 className="font-dosis font-medium text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wider">Autre lien</h3>
                    <p className="font-geist-sans text-gray-800 dark:text-gray-100 text-lg font-medium group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                      {userData.otherLink.replace(/^https?:\/\//, '')}
                    </p>
                  </div>
                </a>
              )}
            </div>
          </div>
        )}
        
        {/* Section de sécurité pour les visiteurs non autorisés */}
        {!isOwner && !userData.isPublicProfile && (
          <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-3xl shadow-2xl p-10 text-center my-10 transform hover:scale-[1.01] transition-transform duration-300">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 mb-6 animate-pulse">
              <FontAwesomeIcon icon={faLock} className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-3xl font-dosis font-bold text-white mb-4">
              Profil privé
            </h2>
            <p className="font-geist-sans text-white/90 mb-8 max-w-md mx-auto text-lg">
              Ce profil est privé. Connectez-vous avec ce compte pour voir les détails complets.
            </p>
            {!session && (
              <Link 
                href="/connexion"
                className="inline-block px-8 py-4 bg-white text-indigo-600 font-medium rounded-xl hover:bg-gray-100 transition-all duration-300 font-geist-sans shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Se connecter
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Modal de signalement */}
      <ReportModal 
        show={showReportModal}
        onClose={() => setShowReportModal(false)}
        onSubmit={handleReportSubmit}
      />
    </div>
  );
}