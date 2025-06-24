"use client"; 
import { useRouter } from 'next/navigation';
import React from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const AccountPage = () => {
  const router = useRouter();
  const userData = {
    name: "Alex Dupont",
    email: "alex.dupont@example.com",
    joined: "15 janvier 2023",
    subscription: "Premium"
  };

  const stats = [
    { label: "Projets", value: 12 },
    { label: "Heures", value: 84 },
    { label: "Tâches", value: 37 },
  ];

  const publications = [
    {
      id: 1,
      title: "Design de l'application mobile",
      description: "Nouveau design pour notre application mobile avec des améliorations UX",
      date: "15 mai 2024",
      likes: 24,
      comments: 8,
      image: "bg-gradient-to-r from-purple-400 to-blue-500"
    },
    {
      id: 2,
      title: "Architecture backend",
      description: "Réflexion sur la nouvelle architecture microservices",
      date: "10 avril 2024",
      likes: 18,
      comments: 5,
      image: "bg-gradient-to-r from-green-400 to-teal-500"
    },
    {
      id: 3,
      title: "Système d'authentification",
      description: "Implémentation d'un nouveau système d'authentification sécurisé",
      date: "28 mars 2024",
      likes: 32,
      comments: 12,
      image: "bg-gradient-to-r from-orange-400 to-red-500"
    }
  ];

  return (
    <div className="min-h-screen bg-white-50 py-8 px-4 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto">
        {/* Bouton Retour Accueil */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/Acceuil')}
            className="inline-flex items-center font-geist-mono text-white-200 hover:text-white-300 transition-colors group"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Retour à l'accueil
          </button>
        </div>

        {/* Section profil */}
        <div className="bg-white-100 rounded-2xl shadow-lg p-6 mb-8 dark:bg-gray-800">
          <div className="flex flex-col md:flex-row items-center">
            <div className="bg-gradient-to-br from-purple-400 to-white-200 w-24 h-24 rounded-full mb-4 md:mb-0 md:mr-6" />
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="font-dosis text-3xl font-bold text-white-300 mb-2 dark:text-white">
                {userData.name}
              </h1>
              
              <div className="font-geist-mono text-white-200 space-y-1 dark:text-gray-300">
                <p>Email: {userData.email}</p>
                <p>Membre depuis: {userData.joined}</p>
                <p className="inline-block px-3 py-1 bg-purple-500/10 text-purple-300 rounded-full mt-2">
                  {userData.subscription}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="bg-gradient-to-br from-white-50 to-white-100 border border-white-100 rounded-xl p-5 text-center shadow-sm dark:from-gray-800 dark:to-gray-700"
            >
              <p className="font-dosis text-4xl font-bold text-white-300 mb-2 dark:text-white">
                {stat.value}
              </p>
              <p className="font-geist-mono text-white-200 uppercase tracking-wider dark:text-gray-400">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Publications partagées */}
        <div className="bg-white-100 rounded-2xl p-6 dark:bg-gray-800">
          <h2 className="font-dosis text-2xl font-bold text-white-300 mb-6 dark:text-white">
            Publications partagées
          </h2>
          
          {publications.length > 0 ? (
            <div className="space-y-6">
              {publications.map((pub) => (
                <div 
                  key={pub.id} 
                  className="border border-white-200 rounded-xl overflow-hidden shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:hover:shadow-gray-700/30"
                >
                  <div className={`h-32 ${pub.image}`} />
                  
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-dosis text-xl font-bold text-white-300 dark:text-white">
                        {pub.title}
                      </h3>
                      <span className="font-geist-mono text-sm text-white-200 dark:text-gray-400">
                        {pub.date}
                      </span>
                    </div>
                    
                    <p className="font-geist-mono text-white-200 mb-4 dark:text-gray-300">
                      {pub.description}
                    </p>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex space-x-4">
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white-200 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                          </svg>
                          <span className="font-geist-mono text-white-200 dark:text-gray-400">
                            {pub.likes}
                          </span>
                        </div>
                        
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white-200 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
                          </svg>
                          <span className="font-geist-mono text-white-200 dark:text-gray-400">
                            {pub.comments}
                          </span>
                        </div>
                      </div>
                      
                      <button className="font-dosis text-purple-300 hover:text-purple-200 transition-colors">
                        Voir plus
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="font-geist-mono text-white-200 dark:text-gray-400">
                Aucune publication partagée pour le moment
              </p>
              <button className="mt-4 font-dosis text-purple-300 hover:text-purple-200 transition-colors">
                Créer votre première publication
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountPage;