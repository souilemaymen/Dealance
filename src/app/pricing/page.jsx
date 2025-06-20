"use client";
import React from 'react'
import {useRouter } from 'next/navigation'; //attention a l'utilisation "next/router" il affiche une erreur 
import Footer from '@/home/Footer'; 
const Pricing = () => { 
  const router = useRouter();
  const goToHome = () => {
    router.push('/');
  }
  return (
    <div className="min-h-screen bg-white-50 text-white-300 p-8 font-dosis">
      <div className="mb-6">
        <button
          onClick={goToHome}
          className="bg-white-200 text-white-50 py-2 px-4 rounded-xl font-semibold hover:bg-white-300 transition"
        >
          ← Retour à l'accueil
        </button>
      </div>
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-16">
        Nos Offres de Tarification
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {/* Plan Basique */}
        <div className="bg-white-100 rounded-2xl shadow-lg p-8 hover:scale-105 transition duration-300">
          <h2 className="text-2xl font-bold mb-4">Basique</h2>
          <p className="text-white-200 mb-6">Pour les étudiants</p>
          <p className="text-3xl font-bold mb-6">10Dt<span className="text-base"> / mois</span></p>
          <ul className="space-y-2 mb-6">
            <li>✓ 1 projet</li>
            <li>✓ Support par mail</li>
            <li>✓ Accès limité</li>
          </ul>
          <button className="bg-white-200 text-white-50 py-2 px-4 rounded-xl font-semibold hover:bg-white-300 transition" onClick={() => router.push('/pricing/basique')} >
            Read more
          </button>
        </div>

        {/* Plan Pro */}
        <div className="bg-white-100 rounded-2xl shadow-xl p-8 border-4 border-white-200 hover:scale-105 transition duration-300" onClick={() => router.push('/pricing/pro')} >
          <h2 className="text-2xl font-bold mb-4">Pro</h2>
          <p className="text-white-200 mb-6">Pour les professionnels</p>
          <p className="text-3xl font-bold mb-6">€29<span className="text-base"> / mois</span></p>
          <ul className="space-y-2 mb-6">
            <li>✓ Projets illimités</li>
            <li>✓ Support prioritaire</li>
            <li>✓ Statistiques avancées</li>
          </ul>
          <button className="bg-white-200 text-white-50 py-2 px-4 rounded-xl font-semibold hover:bg-white-300 transition">
            Read more
          </button>
        </div>

        {/* Plan Entreprise */}
        <div className="bg-white-100 rounded-2xl shadow-lg p-8 hover:scale-105 transition duration-300">
          <h2 className="text-2xl font-bold mb-4">Entreprise</h2>
          <p className="text-white-200 mb-6">Pour les grandes équipes</p>
          <p className="text-3xl font-bold mb-6">€99<span className="text-base"> / mois</span></p>
          <ul className="space-y-2 mb-6">
            <li>✓ Accès complet</li>
            <li>✓ Support dédié 24/7</li>
            <li>✓ Intégrations personnalisées</li>
          </ul>
          <button className="bg-white-200 text-white-50 py-2 px-4 rounded-xl font-semibold hover:bg-white-300 transition" onClick={() => router.push('/pricing/entreprise')} >
            Read more
          </button>
        </div>
      </div>
      <Footer/>
    </div>
  )
}

export default Pricing;