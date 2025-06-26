"use client";
import React from 'react';
import NavbarMenuAcceuil from '@/components/NavbarMenuAcceuil';
import { useSession } from 'next-auth/react';

const SubscriptionPage = () => {
  const { data: session } = useSession();
  
  const plans = [
    {
      id: "basic",
      name: "Basique",
      price: "Gratuit",
      description: "Accès aux fonctionnalités essentielles",
      features: [
        "Création de profil",
        "Accès aux publications",
        "Recherche limitée",
        "Support de base"
      ],
      buttonText: "Commencer",
      popular: false
    },
    {
      id: "pro",
      name: "Pro",
      price: "9.99€",
      period: "/mois",
      description: "Pour les professionnels sérieux",
      features: [
        "Tout dans Basique",
        "Publication illimitée",
        "Contact direct",
        "Statistiques avancées",
        "Support prioritaire"
      ],
      buttonText: "Essai gratuit",
      popular: true
    },
    {
      id: "premium",
      name: "Premium",
      price: "29.99€",
      period: "/mois",
      description: "Pour les experts et entreprises",
      features: [
        "Tout dans Pro",
        "Mise en avant des publications",
        "Accès aux clients premium",
        "Formations exclusives",
        "Support 24/7"
      ],
      buttonText: "S'abonner",
      popular: false
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <NavbarMenuAcceuil />
      <div className="h-16 md:h-20"></div>
      
      <div className="flex-grow bg-white-50 dark:bg-white-300 transition-colors duration-300">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-purple-500 to-indigo-600 py-20">
          <div className="absolute inset-0 bg-[url('/pattern.svg')] bg-cover opacity-10"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-dosis font-bold text-white-50 mb-6">
                Choisissez le plan qui vous convient
              </h1>
              <p className="font-geist-mono text-white-100 text-xl mb-10">
                Accédez à toutes les fonctionnalités premium et boostez votre activité sur Dealance
              </p>
              
              {session?.user?.hasSubscription ? (
                <div className="inline-flex items-center px-6 py-3 bg-green-500 text-white-50 font-dosis font-bold rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Votre abonnement est actif
                </div>
              ) : (
                <div className="bg-white-50 dark:bg-white-300 rounded-xl p-1 inline-flex">
                  <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white-50 font-dosis font-bold rounded-lg">
                    Abonnez-vous maintenant
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Pricing Plans */}
        <div className="container mx-auto px-4 py-16 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div 
                key={plan.id}
                className={`relative rounded-2xl p-8 shadow-xl transition-all duration-300 
                  ${plan.popular 
                    ? 'bg-gradient-to-br from-purple-500 to-indigo-600 transform md:-translate-y-4 border-2 border-purple-400' 
                    : 'bg-white-100 dark:bg-white-200 border border-white-200 dark:border-white-100'
                  }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-yellow-400 text-white-300 font-dosis font-bold px-4 py-1 rounded-full">
                    Le plus populaire
                  </div>
                )}
                
                <h3 className={`text-2xl font-dosis font-bold mb-2 ${plan.popular ? 'text-white-50' : 'text-white-300 dark:text-white-50'}`}>
                  {plan.name}
                </h3>
                
                <div className="mb-6">
                  <span className={`text-4xl font-dosis font-bold ${plan.popular ? 'text-white-50' : 'text-white-300 dark:text-white-50'}`}>
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className={`font-geist-mono ${plan.popular ? 'text-white-100' : 'text-white-200 dark:text-white-100'}`}>
                      {plan.period}
                    </span>
                  )}
                </div>
                
                <p className={`font-geist-mono mb-8 ${plan.popular ? 'text-white-100' : 'text-white-200 dark:text-white-100'}`}>
                  {plan.description}
                </p>
                
                <ul className="mb-10 space-y-4">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg 
                        className={`h-6 w-6 mr-2 flex-shrink-0 ${plan.popular ? 'text-green-300' : 'text-purple-500'}`} 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className={`font-geist-mono ${plan.popular ? 'text-white-100' : 'text-white-300 dark:text-white-100'}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                
                <button 
                  className={`w-full py-3 rounded-lg font-dosis font-bold transition-all duration-300
                    ${plan.popular 
                      ? 'bg-white-50 text-purple-600 hover:bg-white-100' 
                      : 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white-50 hover:from-purple-600 hover:to-indigo-700'
                    }`}
                >
                  {plan.buttonText}
                </button>
              </div>
            ))}
          </div>
        </div>
        
        {/* Benefits Section */}
        <div className="bg-white-100 dark:bg-white-200 py-16">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-dosis font-bold text-white-300 dark:text-white-50 mb-4">
                Pourquoi s'abonner à Dealance Pro?
              </h2>
              <p className="font-geist-mono text-white-200 dark:text-white-100 max-w-2xl mx-auto">
                Profitez d'avantages exclusifs qui vous aideront à développer votre activité
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  ),
                  title: "Visibilité accrue",
                  description: "Apparaissez en tête des résultats de recherche et augmentez votre visibilité"
                },
                {
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  ),
                  title: "Accès premium",
                  description: "Contactez directement les clients et freelancers premium"
                },
                {
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  ),
                  title: "Statistiques avancées",
                  description: "Suivez les performances de vos publications et optimisez votre stratégie"
                },
                {
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                  ),
                  title: "Support prioritaire",
                  description: "Bénéficiez d'un support client dédié et prioritaire"
                }
              ].map((benefit, index) => (
                <div key={index} className="bg-white-50 dark:bg-white-300 rounded-xl p-6 text-center">
                  <div className="mb-4">{benefit.icon}</div>
                  <h3 className="font-dosis font-bold text-white-300 dark:text-white-50 text-xl mb-2">
                    {benefit.title}
                  </h3>
                  <p className="font-geist-mono text-white-200 dark:text-white-100">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* FAQ Section */}
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <h2 className="text-3xl font-dosis font-bold text-center text-white-300 dark:text-white-50 mb-12">
            Questions fréquentes
          </h2>
          
          <div className="space-y-6">
            {[
              {
                question: "Puis-je changer de plan à tout moment?",
                answer: "Oui, vous pouvez passer d'un plan à un autre à tout moment. La différence de prix sera ajustée au prorata."
              },
              {
                question: "Quels modes de paiement acceptez-vous?",
                answer: "Nous acceptons les cartes de crédit (Visa, MasterCard, American Express), PayPal et les virements bancaires."
              },
              {
                question: "Puis-je annuler mon abonnement?",
                answer: "Oui, vous pouvez annuler votre abonnement à tout moment. Vous continuerez à bénéficier des fonctionnalités premium jusqu'à la fin de votre période de facturation."
              },
              {
                question: "L'essai gratuit est-il vraiment gratuit?",
                answer: "Absolument! Vous pouvez essayer le plan Pro gratuitement pendant 14 jours sans obligation. Aucune carte de crédit n'est requise pour commencer l'essai."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white-100 dark:bg-white-200 rounded-xl p-6 border border-white-200 dark:border-white-100">
                <div className="flex justify-between items-center">
                  <h3 className="font-dosis font-bold text-white-300 dark:text-white-50 text-lg">
                    {faq.question}
                  </h3>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <p className="font-geist-mono text-white-200 dark:text-white-100 mt-4">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-dosis font-bold text-white-50 mb-6">
              Prêt à propulser votre activité?
            </h2>
            <p className="font-geist-mono text-white-100 max-w-2xl mx-auto mb-10">
              Rejoignez des milliers de professionnels qui utilisent déjà Dealance pour développer leur business
            </p>
            <button className="inline-flex items-center px-8 py-4 bg-white-50 text-purple-600 font-dosis font-bold rounded-lg hover:bg-white-100 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Commencer mon essai gratuit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;