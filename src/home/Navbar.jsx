"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import SaveButton from "@/components/ContactButton";
import { useRouter } from "next/navigation";

const NavbarMenu = () => {
  const [showNav, setShowNav] = useState(true);
  const [prevScrollY, setPrevScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

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
          </div>

          <div className="hidden md:flex gap-8 text-gray-800 font-medium text-md">
            <span
              onClick={() => router.push("/service")}
              className="relative group cursor-pointer"
            >
              <span className="hover:text-black transition">Services</span>
              <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full mt-2"></span>
            </span>
            <Link href="/pricing" className="relative group cursor-pointer">
            
              <span className="hover:text-black transition" onClick={() => {router.push("/pricing"); setIsMenuOpen(false)}}>Pricing</span>
              <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full mt-2"></span>
              
            </Link>
            <Link href="/" className="relative group cursor-pointer">
              <span className="hover:text-black transition">About</span>
              <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full mt-2"></span>
            </Link>
          </div>

          <SaveButton
            onClick={() => router.push("/contact")}
            className="!bg-transparent !font-medium"
          >
            Contact Us
          </SaveButton>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.nav>

      {/* Fullscreen Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-white/70 backdrop-blur-xl z-40 flex flex-col items-center justify-center space-y-8 text-gray-800 font-semibold text-xl md:hidden"
          >
            <span
              className="cursor-pointer text-5xl font-medium tracking-wider hover:text-black transition"
              onClick={() => {
                router.push("/service");
                setIsMenuOpen(false);
              }}
            >
              Services
            </span>
            <span
              className="cursor-pointer text-5xl font-medium tracking-wider"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </span>
            <span
              className="cursor-pointer text-5xl font-medium tracking-wider"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </span>

            <button
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-5 right-5"
            >
              <X size={28} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavbarMenu;
