"use client"; 
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { ArrowLeftIcon, StarIcon, ClockIcon, FaceSmileIcon, TrophyIcon } from '@heroicons/react/24/outline';
import Badge from '@/components/Badge';

const AccountPage = () => {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Récupérer les données utilisateur
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/user');
        
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des données');
        }
        
        const data = await response.json();
        setUserData(data);
      } catch (err) {
        setError(err.message);
        console.error("Erreur:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Formatage de la date d'inscription
  const formatJoinDate = (dateString) => {
    if (!dateString) return "Date inconnue";
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  const subscriptionBadges = {
    Basique: {
      text: "BASIQUE",
      className: "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30 animate-pulse"
    },
    Pro: {
      text: "PRO",
      className: "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30 animate-pulse"
    },
    Elite: {
      text: "ELITE",
      className: "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30 animate-pulse"
    }
  };

  // Statistiques principales
  const mainStats = [
    { 
      label: "Projets", 
      value: 12,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
        </svg>
      )
    },
    { 
      label: "Heures", 
      value: 84,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
      )
    },
    { 
      label: "Tâches", 
      value: 37,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      )
    },
  ];

  // Compétitions
  const competitions = [
    { 
      id: 1,
      name: "Hackathon TechInnov 2025",
      date: "15-17 mars 2025",
      position: "1ère place",
      participants: 120,
      prize: "5 000€",
      description: "Développement d'une solution IA pour l'éducation"
    },
    { 
      id: 2,
      name: "Challenge Design UX",
      date: "8-10 février 2025",
      position: "Finaliste",
      participants: 85,
      prize: "Certificat d'excellence",
      description: "Conception d'une interface utilisateur innovante"
    },
    { 
      id: 3,
      name: "Compétition DevCloud",
      date: "12 janvier 2025",
      position: "3ème place",
      participants: 65,
      prize: "1 000€",
      description: "Optimisation des solutions cloud pour entreprises"
    }
  ];

  // Évaluations et commentaires
  const reviews = [
    {
      id: 1,
      clientName: "Marie Dupont",
      rating: 5,
      comment: "Excellent travail ! Livraison rapide et professionnelle. Je recommande vivement ce freelance.",
      date: "12 juin 2025",
      project: "Design d'application mobile"
    },
    {
      id: 2,
      clientName: "Jean Martin",
      rating: 4,
      comment: "Très bon travail dans l'ensemble. Quelques retards mineurs mais résultat final de grande qualité.",
      date: "5 juin 2025",
      project: "Développement backend"
    },
    {
      id: 3,
      clientName: "Sophie Leroy",
      rating: 5,
      comment: "Freelance très compétent et réactif. A su comprendre mes besoins et les traduire parfaitement.",
      date: "28 mai 2025",
      project: "Refonte de site web"
    }
  ];

  // Fonction pour afficher les étoiles
  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <StarIcon 
        key={i} 
        className={`w-5 h-5 ${i < rating ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`} 
      />
    ));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 mx-auto mb-6"></div>
            <div className="h-6 w-64 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-4"></div>
            <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-2"></div>
            <div className="h-4 w-56 bg-gray-200 dark:bg-gray-700 rounded mx-auto"></div>
          </div>
          <p className="mt-8 font-geist-mono text-gray-400 dark:text-gray-500">
            Chargement de votre profil...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-8 shadow-md">
            <strong className="font-bold">Erreur ! </strong>
            <span className="block sm:inline">{error}</span>
          </div>
          <button
            onClick={() => router.push('/Acceuil')}
            className="inline-flex items-center font-geist-mono text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors group"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto">
        {/* Bouton Retour Accueil */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/Acceuil')}
            className="inline-flex items-center font-geist-mono text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors group"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Retour à l'accueil
          </button>
        </div>

        {/* Section profil */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
          <div className="flex flex-col md:flex-row items-center">
            {/* Image de profil avec badge */}
            <div className="relative mb-6 md:mb-0 md:mr-8">
              <Badge subscriptionType={userData.subscriptionType}>
                {userData.profileImage ? (
                  <img 
                    src={userData.profileImage} 
                    alt="Profile" 
                    className="w-28 h-28 rounded-full object-cover shadow-md"
                  />
                ) : (
                  <div className="bg-gradient-to-br from-purple-500 to-blue-400 w-28 h-28 rounded-full flex items-center justify-center shadow-md">
                    <span className="text-4xl font-bold text-white">
                      {userData.fullName ? userData.fullName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0,2) : ''}
                    </span>
                  </div>
                )}
              </Badge>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                <h1 className="font-dosis text-3xl font-bold text-gray-800 dark:text-white mb-2 md:mb-0">
                  {userData.fullName || "Utilisateur"}
                </h1>
                
                {/* Badge d'abonnement */}
                {userData.subscriptionType && 
                 userData.subscriptionType !== "Null" && 
                 subscriptionBadges[userData.subscriptionType] && (
                  <div className="mt-2 md:mt-0">
                    <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${subscriptionBadges[userData.subscriptionType].className}`}>
                      {subscriptionBadges[userData.subscriptionType].text}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="font-geist-mono text-gray-600 space-y-2 dark:text-gray-300">
                <p className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  {userData.email}
                </p>
                <p className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  Membre depuis: {formatJoinDate(userData.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistiques principales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {mainStats.map((stat, index) => (
            <div 
              key={index} 
              className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl p-6 text-center shadow-sm dark:from-gray-800 dark:to-gray-700 dark:border-gray-700 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <div className="flex justify-center mb-4">
                <div className="bg-white dark:bg-gray-700 p-3 rounded-full shadow-sm">
                  {stat.icon}
                </div>
              </div>
              <p className="font-dosis text-5xl font-bold text-gray-800 mb-2 dark:text-white">
                {stat.value}
              </p>
              <p className="font-geist-mono text-gray-600 uppercase tracking-wider text-sm dark:text-gray-400">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Évaluations (déplacée avant les compétitions) */}
        <div className="bg-white rounded-2xl p-6 shadow-xl dark:bg-gray-800 border border-gray-100 dark:border-gray-700 mb-8">
          <h2 className="font-dosis text-2xl font-bold text-gray-800 dark:text-white mb-6">
            Évaluations clients
          </h2>
          
          <div className="flex flex-col md:flex-row items-center justify-between mb-8 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-6 rounded-xl">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <p className="font-dosis text-5xl font-bold text-gray-800 dark:text-white mb-2">
                4.8/5
              </p>
              <div className="flex justify-center md:justify-start">
                {renderStars(5)}
              </div>
              <p className="font-geist-mono text-gray-600 dark:text-gray-400 mt-2">
                Moyenne basée sur 24 évaluations
              </p>
            </div>
            
            <div className="w-full md:w-auto">
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((stars) => (
                  <div key={stars} className="flex items-center">
                    <span className="font-geist-mono text-gray-600 dark:text-gray-300 w-8">
                      {stars}
                    </span>
                    <StarIcon className="w-5 h-5 text-amber-500 fill-amber-500 mx-1" />
                    <div className="w-32 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mx-2">
                      <div 
                        className="bg-amber-500 h-2.5 rounded-full" 
                        style={{ width: `${stars * 20}%` }}
                      ></div>
                    </div>
                    <span className="font-geist-mono text-gray-600 dark:text-gray-300 w-8">
                      {stars === 5 ? '24' : stars === 4 ? '3' : '0'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <h3 className="font-dosis text-xl font-bold text-gray-800 dark:text-white mb-6">
            Commentaires des clients
          </h3>
          
          {reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div 
                  key={review.id} 
                  className="border border-gray-200 rounded-xl p-5 dark:border-gray-700 transition-all duration-300 hover:shadow-md"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-dosis text-lg font-bold text-gray-800 dark:text-white">
                        {review.clientName}
                      </h4>
                      <p className="font-geist-mono text-sm text-gray-500 dark:text-gray-400">
                        {review.project}
                      </p>
                    </div>
                    <span className="font-geist-mono text-sm text-gray-500 dark:text-gray-400">
                      {review.date}
                    </span>
                  </div>
                  
                  <div className="flex mb-4">
                    {renderStars(review.rating)}
                  </div>
                  
                  <p className="font-geist-mono text-gray-600 dark:text-gray-300">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <div className="bg-gray-100 dark:bg-gray-700 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <p className="font-geist-mono text-gray-600 dark:text-gray-400 mb-4">
                Aucun commentaire client pour le moment
              </p>
            </div>
          )}
        </div>

        {/* Compétitions (déplacée après les évaluations) */}
        <div className="bg-white rounded-2xl p-6 shadow-xl dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
          <h2 className="font-dosis text-2xl font-bold text-gray-800 dark:text-white mb-6">
            Compétitions
          </h2>
          
          {competitions.length > 0 ? (
            <div className="space-y-6">
              {competitions.map((competition) => (
                <div 
                  key={competition.id} 
                  className="border border-gray-200 rounded-xl p-5 dark:border-gray-700 transition-all duration-300 hover:shadow-md group"
                >
                  <div className="flex items-start">
                    <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-3 rounded-lg mr-4">
                      <TrophyIcon className="h-8 w-8 text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-dosis text-xl font-bold text-gray-800 dark:text-white">
                          {competition.name}
                        </h3>
                        <span className="font-geist-mono text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                          {competition.date}
                        </span>
                      </div>
                      
                      <div className="flex items-center mb-3">
                        <span className="font-geist-mono bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm mr-3">
                          {competition.position}
                        </span>
                        <span className="font-geist-mono text-gray-600 dark:text-gray-400">
                          {competition.participants} participants
                        </span>
                      </div>
                      
                      <p className="font-geist-mono text-gray-600 dark:text-gray-300 mb-3">
                        {competition.description}
                      </p>
                      
                      <div className="flex justify-between items-center">
                        <div className="font-geist-mono text-amber-600 dark:text-amber-400 font-bold">
                          Prix: {competition.prize}
                        </div>
                        <button className="font-dosis text-sm text-purple-500 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors flex items-center group">
                          Voir les détails
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <div className="bg-gray-100 dark:bg-gray-700 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrophyIcon className="h-12 w-12 text-gray-400" />
              </div>
              <p className="font-geist-mono text-gray-600 dark:text-gray-400 mb-4">
                Aucune compétition participée pour le moment
              </p>
              <button className="font-dosis text-sm bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-2 rounded-full shadow-md hover:shadow-lg transition-all">
                Explorer les compétitions
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountPage;