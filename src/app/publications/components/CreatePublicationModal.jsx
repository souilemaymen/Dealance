"use client";

import React from 'react';

const CreatePublicationModal = ({ 
  showModal, 
  closeModal, 
  newPublication, 
  handleChange, 
  addTag, 
  removeTag, 
  handleMediaChange, 
  submitPublication 
}) => {
  return (
    showModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
        <div className="bg-white-50 dark:bg-white-300 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="p-6">
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
    )
  );
};

export default CreatePublicationModal;