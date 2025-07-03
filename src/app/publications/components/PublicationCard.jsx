import React from 'react';

const PublicationCard = ({ pub, handleContact }) => {
  return (
    <div className="bg-white-100 dark:bg-white-200 rounded-xl shadow-lg overflow-hidden transition-all duration-300">
      <div className="p-6 border-b border-white-200 dark:border-white-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {pub.userId?.profileImage ? (
              <img 
                src={pub.userId.profileImage} 
                alt="Profile"
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-white-300 dark:bg-white-100"></div>
            )}
            <div>
              <h3 className="font-dosis font-bold text-white-300 dark:text-white-50">
                {pub.userId?.fullName || 'Utilisateur inconnu'}
              </h3>
              <p className="text-sm font-geist-mono text-white-200 dark:text-white-100">
                {pub.userId?.userType || 'Membre'}
                <span className="mx-2"></span> 
                {pub.createdAt ? new Date(pub.createdAt).toLocaleDateString('fr-FR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                }) : 'Date inconnue'}
              </p>
            </div>
          </div>
          <button className="p-2 rounded-full hover:bg-white-50 dark:hover:bg-white-300 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white-200 dark:text-white-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="p-6">
        <p className="font-geist-mono text-white-300 dark:text-white-100 mb-4">
          {pub.content}
        </p>

        {pub.media && (
          <div className="mb-4 rounded-lg overflow-hidden">
            <img 
              src={pub.media} 
              alt="Média de la publication" 
              className="w-full h-auto max-h-96 object-contain"
            />
          </div>
        )}
        {pub.budget && (
          <div className="mb-4 p-3 bg-white-50 dark:bg-white-300 rounded-lg border border-purple-500">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            <span className="font-geist-mono font-bold text-purple-500">
                      Budget: {pub.budget} Dt
            </span>
            </div>
          </div>
        )}
        
        <div className="flex flex-wrap gap-2 mb-6">
          {pub.tags?.map((tag, index) => (
            <span 
              key={`tag-${pub._id}-${index}`} 
              className="text-xs font-geist-mono px-3 py-1 bg-white-50 dark:bg-white-300 text-white-200 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex justify-end mt-4">
          <button 
            onClick={() => handleContact(pub)}
            className="font-geist-mono px-4 py-2 bg-green-500 hover:bg-green-600 text-white-50 rounded-lg transition-colors"
          >
            Contacter
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublicationCard;