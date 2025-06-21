"use client";
import React, { useState , useEffect } from 'react';
import NavbarMenuAcceuil from '@/components/NavbarMenuAcceuil';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
const PublicationsPage = () => {
    const { data: session } = useSession();
  const [showModal, setShowModal] = useState(false);
  const [publications, setPublications] = useState([]);
  const [newPublication, setNewPublication] = useState({
    content: '',
    tags: [],
    tagInput: '',
    media: null,
    mediaFile: null,
    budget: ''
  });

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const response = await fetch('/api/publications');
        if (response.ok) {
          const data = await response.json();
          setPublications(data);
        } else {
          console.error('Failed to fetch publications');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchPublications();
  }, []);

  // Fonction pour ouvrir la modale
  const openModal = () => setShowModal(true);
  
  // Fonction pour fermer la modale
  const closeModal = () => {
    setShowModal(false);
    setNewPublication({ 
      content: '', 
      tags: [], 
      tagInput: '', 
      media: null,
      budget: '' // Réinitialiser le budget
    });
  };

  // Gestion des changements dans le formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPublication({ ...newPublication, [name]: value });
  };

  // Ajouter un tag
  const addTag = () => {
    if (newPublication.tagInput.trim() && newPublication.tags.length < 5) {
      setNewPublication({
        ...newPublication,
        tags: [...newPublication.tags, newPublication.tagInput.trim()],
        tagInput: ''
      });
    }
  };

  // Supprimer un tag
  const removeTag = (index) => {
    const newTags = [...newPublication.tags];
    newTags.splice(index, 1);
    setNewPublication({ ...newPublication, tags: newTags });
  };

// Modifier la fonction de soumission
const submitPublication = async (e) => {
  e.preventDefault();

  try {
    const formData = new FormData();
    formData.append('content', newPublication.content);
    formData.append('budget', newPublication.budget);
    formData.append('tags', JSON.stringify(newPublication.tags));

    if (newPublication.mediaFile) {
      formData.append('media', newPublication.mediaFile);
    }

    const response = await fetch('/api/publications', {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    if (!response.ok) {
      // Vérifier si la réponse est en JSON
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de la publication");
      } else {
        const text = await response.text();
        throw new Error(`Erreur serveur: ${text}`);
      }
    }

    // Après une publication réussie, recharger les publications
    const res = await fetch('/api/publications');
    if (res.ok) {
      const updatedPublications = await res.json();
      setPublications(updatedPublications);
    } else {
      console.error('Failed to reload publications');
    }
    
    closeModal();
  } catch (error) {
    console.error('Erreur:', error);
    alert(error.message);
  }
};
  // Modifier handleMediaChange pour stocker le fichier
  const handleMediaChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNewPublication({ 
        ...newPublication, 
        media: URL.createObjectURL(e.target.files[0]),
        mediaFile: e.target.files[0] 
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <NavbarMenuAcceuil />
      <div className="h-16 md:h-20"></div>
      
      <div className="flex-grow bg-white-50 dark:bg-white-300 transition-colors duration-300">
        <div className="overflow-hidden py-4 bg-white-100 dark:bg-white-200">
          <div 
            className="animate-scroll whitespace-nowrap"
            style={{ '--animation-duration': '30s' }}
          >
            {[...Array(8)].map((_, i) => (
              <span key={`scroll-${i}`} className="mx-8 text-xl font-dosis font-bold text-white-200 dark:text-white-50">
                Actualités • Publications • Projets • Réalisations • Conseils •
              </span>
            ))}
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 max-w-3xl">
          <div className="mb-8 flex justify-start">
            <button 
              onClick={openModal}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white-50 font-dosis font-bold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 transition-transform group-hover:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="group-hover:tracking-wider transition-all">Créer une publication</span>
            </button>
          </div>
           <div className="space-y-6">
        {publications.map((pub) => (
          <div key={pub._id} className="bg-white-100 dark:bg-white-200 rounded-xl shadow-lg overflow-hidden transition-all duration-300">
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
                          {pub.createdAt ? new Date(pub.createdAt).toLocaleDateString() : 'Date inconnue'}
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
                      {/* Correction pour afficher réellement le média */}
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
                  
                  {/* Tags - CORRECTION: Ajout d'une clé unique */}
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
                </div>
              </div>
            ))}
        </div>

          {/* Bouton pour charger plus de publications */}
          <div className="mt-10 text-center">
            <button className="font-geist-mono px-6 py-3 bg-white-100 dark:bg-white-200 text-white-300 dark:text-white-50 rounded-lg hover:bg-white-200 dark:hover:bg-white-300 transition-colors">
              Charger plus de publications
            </button>
          </div>
        </div>
      </div>

      {/* Modale pour le formulaire */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white-50 dark:bg-white-300 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* En-tête de la modale */}
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-white-200 dark:border-white-100">
                <h2 className="text-2xl font-dosis font-bold text-white-300 dark:text-white-50">
                  Créer une nouvelle publication
                </h2>
                <button 
                  onClick={closeModal}
                  className="p-2 rounded-full hover:bg-white-100 dark:hover:bg-white-200 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white-200 dark:text-white-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Formulaire */}
              <form onSubmit={submitPublication} className="space-y-6">
                <div>
                  <label className="block font-dosis font-bold text-white-300 dark:text-white-50 mb-2">
                    Contenu
                  </label>
                  <textarea
                    name="content"
                    value={newPublication.content}
                    onChange={handleChange}
                    placeholder="Quoi de neuf ? Partagez vos réalisations, conseils ou questions..."
                    className="w-full bg-white-100 dark:bg-white-200 rounded-lg p-4 font-geist-mono text-white-300 dark:text-white-100 placeholder-white-200 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[150px]"
                    required
                  ></textarea>
                </div>

                {/* Nouveau champ Budget */}
                <div>
                  <label className="block font-dosis font-bold text-white-300 dark:text-white-50 mb-2">
                    Budget (optionnel)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <span className="font-geist-mono text-white-200 dark:text-white-100">Dt</span>
                    </div>
                    <input
                      type="text"
                      name="budget"
                      value={newPublication.budget}
                      onChange={handleChange}
                      placeholder="Montant estimé"
                      className="w-full bg-white-100 dark:bg-white-200 rounded-lg pl-10 p-3 font-geist-mono text-white-300 dark:text-white-100 placeholder-white-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-dosis font-bold text-white-300 dark:text-white-50 mb-2">
                    Ajouter une image/vidéo (optionnel)
                  </label>
                  <div className="flex flex-col items-center justify-center border-2 border-dashed border-white-200 dark:border-white-100 rounded-lg p-8 text-center cursor-pointer hover:bg-white-100 dark:hover:bg-white-200 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white-200 dark:text-white-100 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="font-geist-mono text-white-200 dark:text-white-100">
                      Cliquez pour télécharger ou glissez-déposez
                    </p>
                    <p className="text-sm font-geist-mono text-white-200 dark:text-white-100 mt-1">
                      PNG, JPG, GIF ou MP4 (max 10MB)
                    </p>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*,video/*" 
                      onChange={handleMediaChange}
                    />
                  </div>
                  
                  {newPublication.media && (
                    <div className="mt-4 relative">
                      <div className="bg-gray-200 rounded-lg overflow-hidden w-full h-48">
                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-full" />
                      </div>
                      <button 
                        type="button"
                        onClick={() => setNewPublication({...newPublication, media: null})}
                        className="absolute top-2 right-2 bg-white-300 dark:bg-white-100 rounded-full p-1"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block font-dosis font-bold text-white-300 dark:text-white-50 mb-2">
                    Tags (max 5)
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {newPublication.tags.map((tag, index) => (
                      <span 
                        key={index} 
                        className="flex items-center text-xs font-geist-mono px-3 py-1 bg-white-100 dark:bg-white-200 text-white-300 dark:text-white-50 rounded-full"
                      >
                        #{tag}
                        <button 
                          type="button"
                          onClick={() => removeTag(index)}
                          className="ml-2 text-white-200 hover:text-white-300"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      name="tagInput"
                      value={newPublication.tagInput}
                      onChange={handleChange}
                      placeholder="Ajouter un tag"
                      className="flex-grow bg-white-100 dark:bg-white-200 rounded-lg p-3 font-geist-mono text-white-300 dark:text-white-100 placeholder-white-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button 
                      type="button"
                      onClick={addTag}
                      className="px-4 py-2 bg-white-200 dark:bg-white-100 text-white-50 rounded-lg hover:bg-white-300 dark:hover:bg-white-200 transition-colors"
                    >
                      Ajouter
                    </button>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button 
                    type="button"
                    onClick={closeModal}
                    className="font-geist-mono px-6 py-2 bg-white-100 dark:bg-white-200 text-white-300 dark:text-white-50 rounded-lg hover:bg-white-200 dark:hover:bg-white-300 transition-colors"
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit"
                    className="font-geist-mono px-6 py-2 bg-purple-500 text-white-50 rounded-lg hover:bg-purple-600 transition-colors"
                  >
                    Publier
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicationsPage;