"use client"
import { useState, useEffect } from 'react'; 
import { useRouter } from 'next/navigation'; 
import Image from 'next/image'; 
import { motion, AnimatePresence } from 'framer-motion'; 
import Link from "next/link";
import Button from './Button';
import { Menu, X, MessageSquare, LogOut, User, Briefcase, Newspaper, Users ,ChevronRight  } from 'lucide-react';

const NavbarMenuAcceuil = () => {
  const [showNav, setShowNav] = useState(true);
  const [prevScrollY, setPrevScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setShowNav(currentScrollY < prevScrollY || currentScrollY < 10);
      setPrevScrollY(currentScrollY);
      setIsScrolled(currentScrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollY]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [isMenuOpen]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch("/api/auth/session");
        const data = await res.json();
        if (res.ok && data.userId) {
          setUserId(data.userId);
          
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
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      if (response.ok) {
        router.push('/login');
        router.refresh();
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  // Animation variants
  const navVariants = {
    hidden: { y: -100 },
    visible: { y: 0 },
    scrolled: { 
      y: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
    }
  };

  const menuItemVariants = {
    closed: { opacity: 0, y: 20 },
    open: { opacity: 1, y: 0 }
  };

  return (
    <>
      {/* Barre de navigation principale */}
      <motion.nav
        initial="hidden"
        animate={isMenuOpen ? "visible" : showNav ? isScrolled ? "scrolled" : "visible" : "hidden"}
        variants={navVariants}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed top-0 left-0 w-full z-50 backdrop-blur-lg bg-white/80 transition-colors duration-300"
        style={{ display: isMenuOpen ? "none" : "block" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          {/* SECTION LOGO + NOM MODIFIÉE - PLUS GRANDE ET PLUS PRÉSENTABLE */}
          <div className="flex items-center gap-2">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer flex items-center gap-3 group"
              onClick={() => router.push("/")}
            >
              <div className="relative w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-700 p-1.5 shadow-lg transform transition-transform duration-300 group-hover:rotate-3">
                <div className="bg-white w-full h-full rounded flex items-center justify-center">
                  <Image
                    src="/logo2.png"
                    alt="logo"
                    width={32}
                    height={32}
                    loading="lazy"
                    className="transition-opacity duration-300 group-hover:opacity-90"
                  />
                </div>
              </div>
              
              <motion.span
                whileHover={{ color: '#7e22ce' }}
                className="text-3xl font-bold bg-gradient-to-r from-purple-700 to-indigo-800 bg-clip-text text-transparent cursor-pointer tracking-tight"
              >
                Deallance
              </motion.span>
            </motion.div>
            
            {/* Badge profil utilisateur */}
            {userData && (
  <motion.div 
    onClick={() => router.push("/account")}
    whileHover={{ scale: 1.03, backgroundColor: "#f3f0ff" }}
    whileTap={{ scale: 0.98 }}
    className="ml-4 hidden md:flex items-center gap-2 bg-purple-50 rounded-lg px-3 py-1.5 border border-purple-100 shadow-sm cursor-pointer"
  >
    {userData.profileImage ? (
      <motion.img 
        src={userData.profileImage} 
        alt="Profile" 
        className="w-8 h-8 rounded-full object-cover border-2 border-purple-300"
        whileHover={{ rotate: 5 }}
        transition={{ type: "spring", stiffness: 300 }}
      />
    ) : (
      <motion.div 
        className="bg-purple-100 rounded-full w-8 h-8 flex items-center justify-center"
        whileHover={{ rotate: 5 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <User size={18} className="text-purple-600" />
      </motion.div>
    )}
    <motion.span
      className="text-sm font-semibold text-gray-800"
      whileHover={{ color: "#7e22ce" }}
      transition={{ duration: 0.2 }}
    >
      {userData.fullName}
    </motion.span>
    <motion.span
      className="ml-1 text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"
      initial={{ opacity: 0 }}
      animate={{ opacity: 0 }}
      whileHover={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <ChevronRight size={16} />
    </motion.span>
  </motion.div>
)}
          </div>

          {/* Navigation principale - Version desktop */}
          <div className="hidden md:flex gap-6">
            <NavLink href="/publications" icon={<Newspaper size={18} />}>
              Publications
            </NavLink>
            
            <NavLink href="/jobs" icon={<Briefcase size={18} />}>
              Jobs
            </NavLink>
            
            <NavLink href="/clients" icon={<Users size={18} />}>
              Clients
            </NavLink>
          </div>

          {/* Boutons d'action */}
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/messages")}
              className="relative p-2 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-purple-50 transition-colors"
              aria-label="Messages"
            >
              <MessageSquare size={20} className="text-gray-700" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                3
              </span>
            </motion.button>
            
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Button
                onClick={() => userId && router.push("/dashboard")}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium shadow-lg shadow-purple-100"
                disabled={!userId}
              >
                Dashboard
              </Button>
            </motion.div>
            
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="hidden md:flex items-center gap-1 text-gray-600 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-red-50"
              title="Déconnexion"
            >
              <LogOut size={20} />
            </motion.button>
          </div>
          
          {/* Bouton menu mobile */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden bg-white p-2 rounded-full border border-gray-200 shadow-sm"
            aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {isMenuOpen ? (
              <X size={24} className="text-gray-700" />
            ) : (
              <Menu size={24} className="text-gray-700" />
            )}
          </motion.button>
        </div>
      </motion.nav>

      {/* Menu mobile */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="fixed inset-0 bg-white z-40 flex flex-col items-center justify-center space-y-2 p-6"
          >
            {/* Header du menu mobile - MODIFIÉ POUR ÊTRE PLUS GRAND */}
            <div className="w-full flex justify-between items-center mb-10">
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-700 p-2 shadow-lg">
                  <div className="bg-white w-full h-full rounded flex items-center justify-center">
                    <Image
                      src="/logo2.png"
                      alt="logo"
                      width={40}
                      height={40}
                    />
                  </div>
                </div>
                <span className="text-3xl font-bold bg-gradient-to-r from-purple-700 to-indigo-800 bg-clip-text text-transparent tracking-tight">
                  Deallance
                </span>
              </div>
              
              <button
                onClick={() => setIsMenuOpen(false)}
                className="bg-gray-100 p-2 rounded-full"
                aria-label="Fermer le menu"
              >
                <X size={24} className="text-gray-700" />
              </button>
            </div>

            {/* Section profil */}
            {userData && (
              <motion.div 
                    onClick={() => {router.push("/account");setIsMenuOpen(false);}}
                variants={menuItemVariants}
                className="w-full bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-5 flex items-center gap-5 mb-8 border border-purple-100 shadow-sm"
              >
                {userData.profileImage ? (
                  <img 
                    src={userData.profileImage} 
                    alt="Profile" 
                    className="w-16 h-16 rounded-full object-cover border-3 border-purple-300 shadow-md"
                  />
                ) : (
                  <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center border-3 border-purple-300">
                    <User size={28} className="text-purple-600" />
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{userData.fullName}</h3>
                  <p className="text-sm text-purple-600 font-medium">Membre Premium</p>
                </div>
              </motion.div>
            )}

            {/* Items du menu */}
            <MobileNavItem 
              icon={<Newspaper size={24} />}
              text="Publications"
              onClick={() => {
                router.push("/publications");
                setIsMenuOpen(false);
              }}
            />
            
            <MobileNavItem 
              icon={<Briefcase size={24} />}
              text="Jobs"
              onClick={() => {
                router.push("/jobs");
                setIsMenuOpen(false);
              }}
            />
            
            <MobileNavItem 
              icon={<Users size={24} />}
              text="Clients"
              onClick={() => {
                router.push("/clients");
                setIsMenuOpen(false);
              }}
            />
            
            <MobileNavItem 
              icon={<MessageSquare size={24} />}
              text="Messages"
              badge={3}
              onClick={() => {
                router.push("/messages");
                setIsMenuOpen(false);
              }}
            />
            
            <div className="w-full mt-8">
              <Button
                onClick={() => {
                  if (userId) {
                    router.push(`/dashboard`);
                    setIsMenuOpen(false);
                  }
                }}
                className="w-full bg-gradient-to-r from-purple-700 to-indigo-800 hover:from-purple-800 hover:to-indigo-900 text-white font-bold py-4 text-lg shadow-xl"
              >
                Tableau de bord
              </Button>
            </div>
            
            <motion.button
              variants={menuItemVariants}
              onClick={() => {
                handleLogout();
                setIsMenuOpen(false);
              }}
              className="flex items-center gap-3 text-gray-600 hover:text-red-600 transition-colors mt-10 p-4 w-full justify-center border-t border-gray-100"
            >
              <LogOut size={28} className="text-red-500" />
              <span className="text-xl font-bold">Déconnexion</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Composant pour les liens de navigation (version desktop)
const NavLink = ({ href, icon, children }) => (
  <Link href={href} className="group relative px-3 py-2">
    <div className="flex items-center gap-2 text-gray-600 group-hover:text-purple-700 transition-colors">
      {icon}
      <span className="font-medium">{children}</span>
    </div>
    <motion.div 
      className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-600 origin-left"
      initial={{ scaleX: 0 }}
      whileHover={{ scaleX: 1 }}
      transition={{ duration: 0.3 }}
    />
  </Link>
);

// Composant pour les items du menu mobile
const MobileNavItem = ({ icon, text, badge, onClick }) => (
  <motion.button
    variants={{
      closed: { opacity: 0, x: 20 },
      open: { opacity: 1, x: 0 }
    }}
    transition={{ duration: 0.3 }}
    onClick={onClick}
    className="w-full py-5 px-5 rounded-xl flex items-center justify-between hover:bg-gray-50 transition-colors border border-gray-100"
  >
    <div className="flex items-center gap-4">
      <div className="text-purple-600 bg-purple-50 p-2 rounded-lg">
        {icon}
      </div>
      <span className="text-xl font-bold text-gray-800">{text}</span>
    </div>
    
    {badge && (
      <span className="bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold">
        {badge}
      </span>
    )}
  </motion.button>
);

export default NavbarMenuAcceuil;