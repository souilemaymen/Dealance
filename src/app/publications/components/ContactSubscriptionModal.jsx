"use client";

import React from 'react';

const ContactSubscriptionModal = ({ showContactSubscriptionModal, closeContactSubscriptionModal, goToSubscriptionPage }) => {
  return (
    showContactSubscriptionModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
        <div className="bg-white-50 dark:bg-white-300 rounded-2xl shadow-2xl w-full max-w-md">
          <div className="p-8">
            <div className="text-center mb-6">
              <div className="mx-auto bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full p-3 w-16 h-16 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-dosis font-bold text-white-300 dark:text-white-50 mb-2">
                Abonnement Requis
              </h3>
              <p className="font-geist-mono text-white-200 dark:text-white-100">
                Pour contacter les professionnels, vous devez souscrire à un abonnement premium.
              </p>
            </div>

            <div className="bg-white-100 dark:bg-white-200 rounded-xl p-5 mb-6">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-geist-mono text-white-300 dark:text-white-100">
                    Contactez les professionnels sans limite
                  </span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-geist-mono text-white-300 dark:text-white-100">
                    Accédez aux coordonnées complètes
                  </span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-geist-mono text-white-300 dark:text-white-100">
                    Envoyez des messages directs
                  </span>
                </li>
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={closeContactSubscriptionModal}
                className="font-geist-mono px-4 py-3 bg-white-100 dark:bg-white-200 text-white-300 dark:text-white-50 rounded-lg hover:bg-white-200 dark:hover:bg-white-300 transition-colors"
              >
                Plus tard
              </button>
              <button
                onClick={goToSubscriptionPage}
                className="font-geist-mono px-4 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white-50 rounded-lg hover:from-purple-600 hover:to-indigo-700 transition-all"
              >
                S'abonner
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default ContactSubscriptionModal;