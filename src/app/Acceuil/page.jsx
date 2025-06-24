"use client"
import NavbarMenuAcceuil from '@/components/NavbarMenuAcceuil';
import Footer from '@/home/Footer';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';
const Acceuil = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  useEffect(() => {
    if (session?.user?.id) {
      const fetchCurrentUser = async () => {
        try {
          const res = await fetch(`/api/users?userId=${session.user.id}`);
          const user = await res.json();
          setCurrentUser(user);
        } catch (error) {
          console.error('Erreur chargement utilisateur:', error);
        }
      };
      
      fetchCurrentUser();
    }
  }, [session]);

  // Charger les publications
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/publications?page=1');
        const data = await res.json();
        setPosts(data);
      } catch (error) {
        console.error('Erreur chargement publications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Gérer les likes
  const handleLike = async (postId) => {
    if (!currentUser) return;
    
    try {
      const res = await fetch(`/api/publications/${postId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser._id })
      });
      
      const updatedPost = await res.json();
      
      setPosts(prev => prev.map(post => 
        post._id === updatedPost._id ? updatedPost : post
      ));
    } catch (error) {
      console.error('Erreur like:', error);
    }
  };

  // Ajouter un commentaire
  const handleAddComment = async (postId, text) => {
    if (!currentUser || !text.trim()) return;
    
    try {
      const res = await fetch(`/api/publications/${postId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: currentUser._id, 
          text 
        })
      });
      
      const updatedPost = await res.json();
      
      setPosts(prev => prev.map(post => 
        post._id === updatedPost._id ? updatedPost : post
      ));
    } catch (error) {
      console.error('Erreur commentaire:', error);
    }
  };

  // Contacter l'auteur
  const handleContact = (authorId) => {
    router.push(`/messages?userId=${authorId}`);
  };

  return (
        
        <div className="flex flex-col min-h-screen">
          {/* Barre de navigation */}
          <NavbarMenuAcceuil />
          
          {/* Espacement après la Navbar */}
          <div className="h-16 md:h-20"></div>
          
          {/* Contenu principal - Plateforme Freelance */}
          <div className="flex-grow bg-white-50 dark:bg-white-300 transition-colors duration-300">
            {/* Header avec animation de défilement */}
            <div className="overflow-hidden py-4 bg-white-100 dark:bg-white-200">
              <div 
                className="animate-scroll whitespace-nowrap"
                style={{ '--animation-duration': '30s' }}
              >
                {[...Array(8)].map((_, i) => (
                  <span key={i} className="mx-8 text-xl font-dosis font-bold text-white-200 dark:text-white-50">
                    Freelancers • Projets • Design • Développement • Marketing •
                  </span>
                ))}
              </div>
            </div>
    
            {/* Contenu principal */}
            <div className="container mx-auto px-4 py-12 max-w-6xl">
              <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-dosis font-bold text-white-300 dark:text-white-50 mb-6">
                  Plateforme Freelance Connect
                </h1>
                <div className="w-24 h-1 bg-white-200 mx-auto dark:bg-white-100"></div>
                <p className="mt-6 text-xl font-geist-mono text-white-200 dark:text-white-100 max-w-2xl mx-auto">
                  Trouvez des freelancers talentueux ou des projets passionnants
                </p>
              </div>
    
              {/* Section Freelancers */}
              <div className="mb-20">
                <div className="flex justify-between items-center mb-10">
                  <h2 className="text-3xl font-dosis font-bold text-white-300 dark:text-white-50">
                    Freelancers Disponibles
                  </h2>
                  <button className="font-geist-mono px-4 py-2 bg-white-200 dark:bg-white-100 text-white-50 rounded-lg hover:bg-white-300 dark:hover:bg-white-200 transition-colors">
                    Voir tous →
                  </button>
                </div>
    
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[...Array(3)].map((_, index) => (
                    <div 
                      key={index} 
                      className="bg-white-100 dark:bg-white-200 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
                    >
                      <div className="p-6">
                        <div className="flex items-center mb-4">
                          <div className="w-16 h-16 rounded-full bg-white-300 mr-4"></div>
                          <div>
                            <h3 className="text-xl font-dosis font-bold text-white-300 dark:text-white-50">
                              {['Sarah Dev', 'Alex Designer', 'Mike Data'][index]}
                            </h3>
                            <span className="text-sm font-geist-mono bg-white-200 dark:bg-white-300 text-white-50 px-2 py-1 rounded-full">
                              {['Développeur Fullstack', 'UI/UX Designer', 'Data Scientist'][index]}
                            </span>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <div className="flex items-center mb-2">
                            <div className="text-yellow-400 mr-2">★★★★★</div>
                            <span className="text-sm font-geist-mono text-white-200 dark:text-white-100">
                              {['4.9 (42 avis)', '4.8 (36 avis)', '5.0 (28 avis)'][index]}
                            </span>
                          </div>
                          <p className="text-sm font-geist-mono text-white-200 dark:text-white-100">
                            {[
                              'Spécialisée en React, Node.js et bases de données',
                              'Création d\'interfaces modernes et intuitives',
                              'Analyse de données et machine learning'
                            ][index]}
                          </p>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {[
                            ['React', 'Node.js', 'MongoDB'],
                            ['Figma', 'Photoshop', 'UI/UX'],
                            ['Python', 'TensorFlow', 'SQL']
                          ][index].map((skill, i) => (
                            <span key={i} className="text-xs font-geist-mono px-2 py-1 bg-white-50 dark:bg-white-300 text-white-200 rounded">
                              {skill}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="font-geist-mono text-white-300 dark:text-white-50 font-bold">
                            {['70€/h', '65€/h', '80€/h'][index]}
                          </span>
                          <button className="font-geist-mono text-sm bg-purple-500 text-white-50 px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors">
                            Contacter
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
    
              {/* Section Projets */}
              <div className="mb-20">
                <div className="flex justify-between items-center mb-10">
                  <h2 className="text-3xl font-dosis font-bold text-white-300 dark:text-white-50">
                    Projets Disponibles
                  </h2>
                  <button className="font-geist-mono px-4 py-2 bg-white-200 dark:bg-white-100 text-white-50 rounded-lg hover:bg-white-300 dark:hover:bg-white-200 transition-colors">
                    Voir tous →
                  </button>
                </div>
    
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[...Array(3)].map((_, index) => (
                    <div 
                      key={index} 
                      className="bg-white-100 dark:bg-white-200 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
                    >
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <span className="inline-block px-3 py-1 text-sm font-geist-mono bg-white-200 dark:bg-white-300 text-white-50 rounded-full mb-2">
                              {['Urgent', 'Nouveau', 'À pourvoir'][index]}
                            </span>
                            <h3 className="text-xl font-dosis font-bold text-white-300 dark:text-white-50 mb-2 group-hover:text-purple-400 transition-colors">
                              {['Application E-commerce', 'Refonte de Site Web', 'Dashboard Analytique'][index]}
                            </h3>
                          </div>
                          <div className="w-10 h-10 rounded-full bg-white-300"></div>
                        </div>
                        
                        <p className="text-white-200 dark:text-white-100 font-geist-mono mb-6">
                          {[
                            'Développement plateforme e-commerce avec système de paiement',
                            'Modernisation d\'un site web existant avec design responsive',
                            'Création d\'un tableau de bord pour analyse de données'
                          ][index]}
                        </p>
                        
                        <div className="flex flex-wrap gap-2 mb-6">
                          {[
                            ['React', 'Stripe', 'UI/UX'],
                            ['WordPress', 'CSS', 'Responsive'],
                            ['React', 'D3.js', 'API']
                          ][index].map((skill, i) => (
                            <span key={i} className="text-xs font-geist-mono px-2 py-1 bg-white-50 dark:bg-white-300 text-white-200 rounded">
                              {skill}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="block font-geist-mono text-white-300 dark:text-white-50 font-bold">
                              Budget: {['5 000€', '3 200€', '4 500€'][index]}
                            </span>
                            <span className="block text-sm font-geist-mono text-white-200 dark:text-white-100">
                              Délai: {['2 mois', '3 semaines', '1 mois'][index]}
                            </span>
                          </div>
                          <button className="font-geist-mono text-sm bg-purple-500 text-white-50 px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors">
                            Postuler
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
    
              {/* Section Catégories */}
              <div className="mb-20">
                <h2 className="text-3xl font-dosis font-bold text-white-300 dark:text-white-50 mb-10 text-center">
                  Catégories Populaires
                </h2>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {['Développement', 'Design', 'Rédaction', 'Marketing', 'Vidéo', 'Data', 'SEO', 'Traduction'].map((category, index) => (
                    <div 
                      key={index} 
                      className="bg-white-100 dark:bg-white-200 rounded-xl p-6 text-center hover:bg-white-200 dark:hover:bg-white-300 transition-colors cursor-pointer"
                    >
                      <div className="w-12 h-12 bg-white-300 dark:bg-white-100 rounded-full mx-auto mb-4"></div>
                      <h3 className="font-dosis font-bold text-white-300 dark:text-white-50">
                        {category}
                      </h3>
                      <p className="text-sm font-geist-mono text-white-200 dark:text-white-100 mt-2">
                        {[120, 95, 78, 110, 65, 88, 102, 59][index]}+ freelancers
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
      <Footer/>

        </div>  
  );
};
export default Acceuil;