"use client";
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import Footer from '@/home/Footer';

const plans = {
  basique: {
    title: 'Basique',
    description: 'Pour les Débutants',
    price: '0Dt / mois',
    features: ['14 jours', 'Support par mail', 'Accès limité']
  },
  pro: {
    title: 'Pro',
    description: 'Pour les professionnels',
    price: '€29 / mois',
    features: ['Projets illimités', 'Support prioritaire', 'Statistiques avancées']
  },
  entreprise: {
    title: 'Entreprise',
    description: 'Pour les grandes équipes',
    price: '€99 / mois',
    features: ['Accès complet', 'Support customer 24/7', 'Intégrations personnalisées']
  }
};

export default function PlanDetailPage() {
  const { plan } = useParams();
  const router = useRouter();
  const currentPlan = plans[plan];

  if (!currentPlan) {
    return <div className="p-10 text-red-500 font-bold">Plan introuvable.</div>;
  }

  return (
    <div className="min-h-screen bg-white-50 text-white-300 p-8 font-dosis">
      <button
        onClick={() => router.push('/pricing')}
        className="bg-white-200 text-white-50 py-2 px-4 mb-6 rounded-xl font-semibold hover:bg-white-300 transition"
      >
        ← Retour aux offres
      </button>

      <div className="bg-white-100 rounded-2xl shadow-xl p-10 max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">{currentPlan.title}</h1>
        <p className="text-white-200 mb-4">{currentPlan.description}</p>
        <p className="text-3xl font-bold mb-6">{currentPlan.price}</p>
        <ul className="list-disc list-inside space-y-2 mb-6">
          {currentPlan.features.map((feature, index) => (
            <li key={index}>✓ {feature}</li>
          ))}
        </ul>
        <button className="bg-white-200 text-white-50 py-2 px-4 rounded-xl font-semibold hover:bg-white-300 transition">
          Choisir cette offre
        </button>
      </div>
      <Footer/>
    </div>
  );
}
