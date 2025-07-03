// components/ReportModal.jsx
"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faUserShield, 
  faLock, 
  faTimes,
  faExclamationTriangle
} from "@fortawesome/free-solid-svg-icons";

const reportOptions = [
  { id: "falcification", label: "Spam ou publicité indésirable" },
  { id: "inappropriate", label: "Contenu inapproprié" },
  { id: "impersonation", label: "Usurpation d'identité" },
  { id: "harassment", label: "Harcèlement ou intimidation" },
  { id: "scam", label: "Arnaque ou fraude" },
  { id: "other", label: "Autre raison" }
];

export default function ReportModal({ 
  show, 
  onClose, 
  onSubmit
}) {
  const [selectedReason, setSelectedReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedReason) {
      setError("Veuillez sélectionner une raison");
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await onSubmit(selectedReason);
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Une erreur s'est produite");
    } finally {
      setSubmitting(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 w-full max-w-md border border-gray-200 dark:border-gray-700 relative transform transition-all duration-300 scale-95 animate-scaleIn">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
        >
          <FontAwesomeIcon icon={faTimes} className="h-5 w-5" />
        </button>
        
        {success ? (
          <div className="text-center py-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
              <FontAwesomeIcon icon={faLock} className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-dosis font-bold text-gray-800 dark:text-white mb-3">
              Signalement envoyé
            </h3>
            <p className="font-geist-sans text-gray-600 dark:text-gray-300 mb-6">
              Merci pour votre signalement. Notre équipe va examiner le profil.
            </p>
            <button
              onClick={onClose}
              className="w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:opacity-90 transition-opacity font-geist-sans shadow-md"
            >
              Fermer
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center mb-5">
              <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center mr-3">
                <FontAwesomeIcon icon={faUserShield} className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-dosis font-bold text-gray-300 dark:text-white">
                Signaler ce profil
              </h3>
            </div>
            
            <form onSubmit={handleSubmit}>
              <p className="font-geist-sans text-gray-300 dark:text-gray-300 mb-4">
                Veuillez sélectionner la raison du signalement :
              </p>
              
              <div className="space-y-3 mb-6">
                {reportOptions.map((option) => (
                  <div 
                    key={option.id}
                    className={`flex items-start p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                      selectedReason === option.id
                        ? "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-300 dark:border-indigo-700"
                        : "bg-gray-50 dark:bg-gray-700/30 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                    }`}
                    onClick={() => setSelectedReason(option.id)}
                  >
                    <input
                      type="radio"
                      id={option.id}
                      name="reportReason"
                      checked={selectedReason === option.id}
                      onChange={() => setSelectedReason(option.id)}
                      className="mt-1 mr-3 h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label 
                      htmlFor={option.id} 
                      className="font-geist-sans text-gray-700 dark:text-gray-300 cursor-pointer"
                    >
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
              
              {error && (
                <div className="flex items-start p-4 bg-red-50 dark:bg-red-900/20 rounded-xl mb-4">
                  <FontAwesomeIcon 
                    icon={faExclamationTriangle} 
                    className="h-5 w-5 text-red-500 dark:text-red-400 mt-1 mr-3 flex-shrink-0" 
                  />
                  <p className="text-red-500 font-geist-sans">{error}</p>
                </div>
              )}
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={submitting}
                  className="px-5 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-geist-sans"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl hover:opacity-90 transition-opacity font-geist-sans shadow-md flex items-center disabled:opacity-70"
                >
                  <FontAwesomeIcon icon={faUserShield} className="h-4 w-4 mr-2" />
                  {submitting ? 'Envoi en cours...' : 'Signaler'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}