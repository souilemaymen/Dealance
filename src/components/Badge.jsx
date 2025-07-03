// Badge.jsx
import React from 'react';

const Badge = ({ subscriptionType, children }) => {
  // Définition des styles de badge selon le type d'abonnement
  const getBadgeStyle = () => {
    switch(subscriptionType) {
      case 'Basique':
        return {
          borderColor: 'border-blue-500',
          ringColor: 'ring-blue-500/30',
          glow: 'shadow-[0_0_20px_rgba(59,130,246,0.4)]',
          gradient: 'from-blue-500 to-cyan-500',
          elite: false
        };
      case 'Pro':
        return {
          borderColor: 'border-indigo-500',
          ringColor: 'ring-indigo-500/30',
          glow: 'shadow-[0_0_20px_rgba(99,102,241,0.4)]',
          gradient: 'from-indigo-500 to-purple-500',
          elite: false
        };
      case 'Elite':
        return {
          borderColor: 'border-amber-500',
          ringColor: 'ring-amber-500/30',
          glow: 'shadow-[0_0_20px_rgba(245,158,11,0.4)]',
          gradient: 'from-amber-500 to-orange-500',
          elite: true // Spécifique à Elite
        };
      default:
        return {
          borderColor: 'border-transparent',
          ringColor: 'ring-transparent',
          glow: '',
          gradient: '',
          elite: false
        };
    }
  };

  const badgeStyle = getBadgeStyle();

  // Composant pour l'icône de couronne
  const CrownIcon = () => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      className="h-5 w-5 text-white"
    >
      <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
    </svg>
  );

  return (
    <div className={`relative inline-block rounded-full ${badgeStyle.glow} group transition-all duration-300`}>
      {/* Conteneur principal avec effet de halo */}
      <div className="relative p-[3px] rounded-full bg-gradient-to-br from-white/30 to-transparent">
        {children}
        
        {/* Cercle de badge avec dégradé moderne */}
        {subscriptionType && subscriptionType !== "Null" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${badgeStyle.gradient} opacity-20 blur-sm`}></div>
            <div className={`absolute inset-0 rounded-full border-2 ${badgeStyle.borderColor} ${badgeStyle.ringColor} ring-4`}></div>
          </div>
        )}
        
        {/* Couronne pour les abonnés Elite */}
        {badgeStyle.elite && (
          <div className="absolute -top-2 -right-2 z-10 transform rotate-12">
            <div className="bg-gradient-to-r from-amber-400 to-orange-500 p-1.5 rounded-full shadow-lg flex items-center justify-center">
              <CrownIcon />
            </div>
          </div>
        )}
      </div>

      {/* Étiquette flottante moderne */}
      {subscriptionType && subscriptionType !== "Null" && (
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className={`px-4 py-2 rounded-full text-xs font-bold uppercase text-white bg-gradient-to-r ${badgeStyle.gradient} shadow-lg flex items-center`}>
            {subscriptionType}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

export default Badge;