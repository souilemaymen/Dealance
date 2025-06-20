"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const DashboardContent = () => {
  const [userType, setUserType] = useState("");
  const [username , setUsername] = useState("User");
  
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Récupérer la session
        const sessionRes = await fetch("/api/auth/session");
        const sessionData = await sessionRes.json();
        
        if (!sessionRes.ok) {
          console.error("Session error:", sessionData.message);
          return;
        }

        // 2. Récupérer les données utilisateur
        if (sessionData.userId) {
          const userRes = await fetch(`/api/user?userId=${sessionData.userId}`);
          const userData = await userRes.json();
          
          // 3. Mettre à jour l'état
          setUsername(userData.fullName || "User");
          setUserType(sessionData.userType || "");
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchData();
  }, []);
  
  const words = `Welcome back, ${username}!`.split(" ");

  const message =
    userType === "freelancer"
      ? "Every project is a new adventure ! You are here as a Freelancer—showcase your skills, seize opportunities, and build your dream career !"
      : "Great ideas deserve great execution ! You are here as a Client—connect with top talents and turn your vision into reality !";

  return (
    <section className="flex flex-1 justify-center items-center w-full h-screen px-4">
      {/*We replace the w-screen with w-full to make it responsivecontent this one */}
      <motion.div
        layout
        className="text-center space-y-12 font-extrabold tracking-wide"
      >
        <motion.h1
          layout
          className="text-gray-800 ~text-4xl/6xl"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, y: -30 },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                delay: 0.5,
                duration: 0.8,
                ease: "easeOut",
                staggerChildren: 0.15,
              },
            },
          }}
        >
          {words.map((word, index) => (
            <motion.span
              key={index}
              className="inline-block mr-2"
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 30 },
              }}
              transition={{ type: "spring", stiffness: 100, damping: 10 }}
            >
              {word}
            </motion.span>
          ))}
        </motion.h1>
        <motion.p
          className="~text-lg/xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
        >
          {message}
        </motion.p>

        <motion.button
          className="bg-black text-white-50 px-6 py-3 rounded-lg shadow-lg"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {userType === "freelancer" ? "Find Projects" : "Hire Talent"}
        </motion.button>
      </motion.div>
    </section>
  );
};

export default DashboardContent;
