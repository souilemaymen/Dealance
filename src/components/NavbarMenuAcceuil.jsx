"use client"
import { useState, useEffect } from 'react'; 
import { useRouter } from 'next/navigation'; 
import Image from 'next/image'; 
import { motion, AnimatePresence } from 'framer-motion'; 
import Link from "next/link";
import Button from './Button';
import { Menu, X, MessageSquare, LogOut } from 'lucide-react';

const NavbarMenuAcceuil = () => {
  const [showNav, setShowNav] = useState(true);
  const [prevScrollY, setPrevScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState(null); // Nouvel état pour les données utilisateur

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setShowNav(currentScrollY < prevScrollY || currentScrollY < 10);
      setPrevScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollY]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch("/api/auth/session");
        const data = await res.json();
        if (res.ok && data.userId) {
          setUserId(data.userId);
          
          // Récupérer les données complètes de l'utilisateur
          const userRes = await fetch(`/api/user?userId=${data.userId}`);
          if (userRes.ok) {
            const userData = await userRes.json();
            setUserData(userData);
          }
        }
      } catch (err) {
        console.error("Error fetching user data", err);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST'
      });
      
      if (response.ok) {
        router.push('/login');
        router.refresh();
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: 0 }}
        animate={{ y: showNav ? 0 : -100 }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 w-full z-50 backdrop-blur-lg bg-white/50 shadow-md"
        style={{ display: isMenuOpen ? "none" : "block" }}
      >
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xl font-bold text-gray-900">
            <Image
              src="/logo2.png"
              alt="logo"
              width={32}
              height={32}
              loading="lazy"
              onClick={() => router.push("/")}
              className="cursor-pointer"
            />
            <span
              onClick={() => router.push("/")}
              className="font-normal cursor-pointer"
            >
              Deallance
            </span>
            
            {/* Affichage du profil utilisateur à côté de "Deallance" */}
            {userData && (
              <div className="flex items-center gap-2 ml-4">
                {userData.profileImage ? (
                  <img 
                    src={userData.profileImage} 
                    alt="Profile" 
                    className="w-8 h-8 rounded-full object-cover border-2 border-purple-500"
                  />
                ) : (
                  <div className="bg-gray-200 border-2 border-dashed rounded-full w-8 h-8" />
                )}
                <span className="text-sm font-medium text-gray-800">
                  {userData.fullName}
                </span>
              </div>
            )}
          </div>

          {/* Navigation principale */}
          <div className="hidden md:flex gap-8 text-gray-800 font-medium text-md">
            <Link href="/publications" className="relative group cursor-pointer">
              <span className="hover:text-black transition">Publications</span>
              <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full mt-2"></span>
            </Link>
            
            <Link href="/jobs" className="relative group cursor-pointer">
              <span className="hover:text-black transition">Jobs</span>
              <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full mt-2"></span>
            </Link>
            
            <Link href="/clients" className="relative group cursor-pointer">
              <span className="hover:text-black transition">Clients</span>
              <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full mt-2"></span>
            </Link>
          </div>

          {/* Boutons d'action */}
          <div className="flex items-center gap-4">
            <Button
              onClick={() => router.push("/messages")}
              className="!bg-transparent !font-medium flex items-center gap-1"
            >
              <MessageSquare size={18} />
              Messages
            </Button>
            
            <Button
               onClick={() => userId && router.push("/dashboard")}
              className="!bg-white-200 !text-white-50 !font-medium"
              disabled={!userId}
            >
              Dashboard
            </Button>
            
            {/* Bouton de déconnexion - Version desktop */}
            <button 
              onClick={handleLogout}
              className="flex items-center gap-1 text-gray-800 hover:text-red-600 transition-colors"
              title="Déconnexion"
            >
              <LogOut size={20} />
              <span className="hidden md:inline">Déconnexion</span>
            </button>
          </div>
          
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden"
            aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-white/70 backdrop-blur-xl z-40 flex flex-col items-center justify-center space-y-8 text-gray-800 font-semibold text-xl md:hidden"
          >
            {/* Section profil en version mobile */}
            {userData && (
              <div className="absolute top-5 left-5 flex items-center gap-3">
                {userData.profileImage ? (
                  <img 
                    src={userData.profileImage} 
                    alt="Profile" 
                    className="w-10 h-10 rounded-full object-cover border-2 border-purple-500"
                  />
                ) : (
                  <div className="bg-gray-200 border-2 border-dashed rounded-full w-10 h-10" />
                )}
                <span className="text-xl font-medium text-gray-800">
                  {userData.fullName}
                </span>
              </div>
            )}
            
            <span
              className="cursor-pointer text-4xl font-medium tracking-wider hover:text-black transition"
              onClick={() => {
                router.push("/publications");
                setIsMenuOpen(false);
              }}
            >
              Publications
            </span>
            
            <span
              className="cursor-pointer text-4xl font-medium tracking-wider hover:text-black transition"
              onClick={() => {
                router.push("/jobs");
                setIsMenuOpen(false);
              }}
            >
              Jobs
            </span>
            
            <span
              className="cursor-pointer text-4xl font-medium tracking-wider hover:text-black transition"
              onClick={() => {
                router.push("/clients");
                setIsMenuOpen(false);
              }}
            >
              Clients
            </span>
            
            <span
              className="cursor-pointer text-4xl font-medium tracking-wider hover:text-black transition flex items-center gap-2"
              onClick={() => {
                router.push("/messages");
                setIsMenuOpen(false);
              }}
            >
              <MessageSquare size={28} /> Messages
            </span>
            
            <span
              className="cursor-pointer text-4xl font-medium tracking-wider bg-white-200 text-white-50 px-6 py-3 rounded-lg mt-4"
              onClick={() => {
                if (userId) {
                  router.push(`/dashboard`);
                  setIsMenuOpen(false);
                }
              }}
            >
              Dashboard
            </span>
            
            <button
              onClick={() => {
                handleLogout();
                setIsMenuOpen(false);
              }}
              className="flex items-center gap-2 text-4xl font-medium tracking-wider text-red-600 hover:text-red-800 transition-colors mt-8"
            >
              <LogOut size={28} />
              Déconnexion
            </button>

            <button
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-5 right-5"
              aria-label="Fermer le menu"
            >
              <X size={28} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavbarMenuAcceuil;