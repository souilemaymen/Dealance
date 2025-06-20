"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.4,
      ease: "easeOut",
    },
  }),
};

const ReadOnlyField = ({
  label,
  value,
  isTextarea = false,
  index = 0,
}) => {
  return (
    <motion.div
      className="flex flex-col gap-1"
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      custom={index}
    >
      <label className="text-sm text-gray-500">{label}</label>
      <div className="flex items-center gap-20">
        <div className="flex justify-between w-full">
          <span className="text-md text-gray-800 whitespace-pre-line">
            {value || (isTextarea ? "No bio added" : "Not specified")}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

const AccountPage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Étape 1: Récupérer le userId depuis la session via les cookies HTTP-Only
        const sessionRes = await fetch("/api/auth/session");
        const sessionData = await sessionRes.json();
        
        if (!sessionRes.ok || !sessionData.userId) {
          throw new Error("Session not found");
        }

        const userId = sessionData.userId;

        // Étape 2: Récupérer les données utilisateur
        const profileRes = await fetch(`/api/user?userId=${userId}`);
        const profileData = await profileRes.json();
        
        if (!profileRes.ok) {
          throw new Error(profileData.error || "Failed to fetch profile");
        }

        setProfile(profileData);
      } catch (error) {
        console.error("Error fetching profile:", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 flex justify-center">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <p>Failed to load profile data</p>
      </div>
    );
  }

  return (
    <motion.div
      className="max-w-3xl mx-auto px-4 py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.h1
        className="text-2xl font-semibold mb-8"
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        Account
      </motion.h1>

      <motion.div
        className="bg-white-50 p-6 rounded-xl shadow-md space-y-6"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <h2 className="text-lg font-semibold text-gray-700">
          Profile Information
        </h2>
        <hr className="mb-2" />

        <div className="flex flex-col sm:flex-row gap-8 items-start">
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {profile.profileImage ? (
              <Image
                src={profile.profileImage}
                alt="profile"
                width={180}
                height={180}
                className="rounded-full object-contain border border-gray-300"
              />
            ) : (
              <div className="bg-gray-200 border-2 border-dashed rounded-full w-[90px] h-[90px]" />
            )}
          </motion.div>

          <motion.div 
            className="flex-1 space-y-5 w-full ml-8"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.15,
                },
              },
            }}
          >
            <ReadOnlyField
              label="Name"
              value={profile.fullName}
              index={0}
            />
            <ReadOnlyField
              label="Email"
              value={profile.email}
              index={1}
            />
            <ReadOnlyField
              label="Phone"
              value={profile.phoneNumber}
              index={2}
            />
            <ReadOnlyField
              label="Bio"
              value={profile.bio}
              isTextarea
              index={3}
            />
            <ReadOnlyField
              label="Category"
              value={profile.category}
              index={4}
            />
            <ReadOnlyField
              label="Experience"
              value={profile.experience}
              index={5}
            />
            <ReadOnlyField
              label="GitHub"
              value={profile.github}
              index={6}
            />
            <ReadOnlyField
              label="LinkedIn"
              value={profile.linkedin}
              index={7}
            />
            <ReadOnlyField
              label="Portfolio"
              value={profile.portfolio}
              index={8}
            />
            <ReadOnlyField
              label="Technologies"
              value={profile.technologies}
              index={9}
            />
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AccountPage;