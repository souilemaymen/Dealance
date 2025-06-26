import React, { useState } from 'react';

const ContactModal = ({ publication, onClose }) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    
    try {
      // Simuler l'envoi du message
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsSent(true);
      
      // Réinitialiser après succès
      setTimeout(() => {
        setIsSent(false);
        setMessage('');
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white-50 dark:bg-white-300 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-dosis font-bold text-white-300 dark:text-white-50">
              Contacter {publication.userId?.fullName || 'le professionnel'}
            </h2>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white-100 dark:hover:bg-white-200 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white-200 dark:text-white-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {isSent ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-dosis font-bold text-green-500 mb-2">
                Message envoyé!
              </h3>
              <p className="font-geist-mono text-white-200 dark:text-white-100">
                Votre message a été envoyé avec succès.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block font-dosis font-bold text-white-300 dark:text-white-50 mb-2">
                  Votre message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={`Bonjour ${publication.userId?.fullName || ''}, je suis intéressé par votre publication...`}
                  className="w-full bg-white-100 dark:bg-white-200 rounded-lg p-4 font-geist-mono text-white-300 dark:text-white-100 placeholder-white-200 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[150px]"
                  required
                ></textarea>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button 
                  type="button"
                  onClick={onClose}
                  className="font-geist-mono px-6 py-2 bg-white-100 dark:bg-white-200 text-white-300 dark:text-white-50 rounded-lg hover:bg-white-200 dark:hover:bg-white-300 transition-colors"
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  disabled={isSending}
                  className="font-geist-mono px-6 py-2 bg-purple-500 text-white-50 rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-75"
                >
                  {isSending ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Envoi en cours...
                    </span>
                  ) : "Envoyer"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactModal;