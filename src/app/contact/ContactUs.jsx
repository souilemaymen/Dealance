"use client";
import { SparklesCore } from "@/components/Sparkles";
import React, { useState } from "react";
import { motion } from "framer-motion";
const ContactUs = () => {
  // etape 1  : pour stocker les valeurs du formulaire 
    const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  // fin etape 
  // etape pour la gestion de changement dans les champs de formulaire 
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState(null); // null, 'success' ou 'error'



  // etape 2 :etat pour gere le statut de l'envoi 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };// fin etape 2

  // etape 3 : fonction de handleSubmit
   // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setStatus(null);

    try {
      // Envoi des données à l'API
      const response = await fetch('/api/contact/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setStatus('success');
        // Réinitialisation du formulaire après succès
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error("Erreur d'envoi:", error);
      setStatus('error');
    } finally {
      setIsSending(false);
    }
  };// fin etape 3
  return (
    <section className="pt-20">
      <div className="flex items-center justify-center min-h-screen relative p-6 sm:p-10 md:p-12 lg:p-16">
        <div className="w-full absolute h-screen">
          <SparklesCore
            background="transparent"
            minSize={0.4}
            maxSize={1.4}
            className="w-full h-full"
            particleColor="#302546"
          />
        </div>
        <motion.div
          className="w-full max-w-md -mt-16 p-6 bg-white-200 shadow-2xl shadow-white-300 rounded-2xl relative z-20"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <motion.h2
            className="~text-2xl/4xl font-black text-center text-white-50 mb-6 tracking-wider"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Contact Us
          </motion.h2>
          {/* Message de Statut */} {status === 'success' && (
            <motion.div className="bg-green-100 text-green-700 p-3 mb-4 rounded-lg" initial={{opacity: 0}} animate={{opacity: 1}}>
              Message envoyé avec succes ! 
            </motion.div>
          )}
          {status === 'error' && (
            <motion.div className="bg-red-100 text-red-700 p-3 mb-4 rounded-lg" initial={{opacity: 0}} animate={{opacity: 1}} >
              Erreur lors de l'envoi . veuillez réessayer 
            </motion.div>
          )}



          {/* fin message de status*/}
          <form onSubmit={handleSubmit} className="space-y-4">
            <motion.input
              name="name"
              type="text"
              value={formData.name} 
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full px-4 py-2 bg-white-100 border-none rounded-lg focus:ring-2 focus:ring-white-300 focus:outline-none"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              whileFocus={{ scale: 1.02 }}
              required
            />
            <motion.input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white-100 border-none rounded-lg focus:ring-2 focus:ring-white-300 focus:outline-none"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }} 
              whileFocus={{ scale: 1.02 }}
              required
            />
            <motion.textarea
              name="message"
              placeholder="Your Message"
              className="w-full px-4 py-2 bg-white-100 border-none rounded-lg focus:ring-2 focus:ring-white-300 focus:outline-none"
              value={formData.message}
              onChange={handleChange}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
              whileFocus={{ scale: 1.02 }}
              rows="4"
              required
            />
            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <motion.button
                type="submit"
               // className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 px-4 py-2 font-bold text-white-50 bg-white-200 rounded-lg hover:bg-white-300 transition duration-300"
                className={`w-full sm:w-3/4 md:w-2/3 lg:w-1/2 px-4 py-2 font-bold text-white-50 bg-white-200 rounded-lg transition duration-300 ${
                  isSending 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-white-300'
                }`}
                //whileHover={{ scale: 1.05, rotate: 1 }}
                whileHover={!isSending ? { scale: 1.05, rotate: 1 } : {}}
                //whileTap={{ scale: 0.95 }}
                whileTap={!isSending ? { scale: 0.95 } : {}}
                transition={{ duration: 0.2 }}
                disabled={isSending} // Désactive pendant l'envoi
              >
                {isSending ? 'Sending...' : 'Send Message'}
              </motion.button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactUs;
