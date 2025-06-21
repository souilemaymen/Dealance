"use client";
import {
  ChevronDown,
  ChevronsRight,
  HandCoins,
  History,
  LockKeyhole,
  Settings,
  User,
  Home,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export const Dashboard = () => {
  return (
    <div className="flex">
      <SideBar />
    </div>
  );
};

const SideBar = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("");
  const [username, setUsername] = useState("User");
  const [userId, setUserId] = useState(null);
  const router = useRouter();
  const [profileImage, setProfileImage] = useState(null);
  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setOpen(true);
      } else {
        setOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);
 
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch("/api/auth/session", {
          credentials: "include"
        });
        
        if (res.status === 401) {
          console.log("Session non authentifiée");
          return;
        }

        const data = await res.json();
        
        if (res.ok && data.userId) {
          setUserId(data.userId);
          
          const userRes = await fetch(`/api/user?userId=${data.userId}`, {
            credentials: 'include'
          });
          
          if (userRes.ok) {
            const userData = await userRes.json();
            setUsername(userData.fullName); 
            setProfileImage(userData.profileImage);
          }
        }
      } catch (err) {
        console.error("Erreur lors de la récupération de session:", err);
      }
    };

    fetchSession();
  }, []);

  return (
    <motion.nav
      layout
      className="sticky top-0 h-screen shrink-0 border-r border-slate-400 
    bg-white-50 p-2 overflow-hidden" 
      style={{
        width: open ? "225px" : "fit-content",
      }}
    >
      <div className="flex justify-end mb-2">
        <motion.button
          layout
          onClick={() => router.push("/Acceuil")}
          className="p-2 rounded-full hover:bg-white-100 transition-colors"
          aria-label="Retour à l'accueil"
        >
          <Home size={20} />
        </motion.button>
      </div>

      <TitleSection open={open} username={username} profileImage={profileImage} />
      <div className="space-y-1">
        <Option
          Icon={Settings}
          title="Settings"
          selected={selected}
          setSelected={setSelected}
          open={open}
          delay={0.225}
        />
        <Option
          Icon={LockKeyhole}
          title="Security & Privacy"
          selected={selected}
          setSelected={setSelected}
          open={open}
          delay={0.325}
        />
        <Option
          Icon={HandCoins}
          title="Billing & Payments"
          selected={selected}
          setSelected={setSelected}
          open={open}
          delay={0.425}
        />
        <Option
          Icon={History}
          title="Activity History"
          selected={selected}
          setSelected={setSelected}
          open={open}
          delay={0.525}
        />
      </div>
      <ToggleClose open={open} setOpen={setOpen} />
    </motion.nav>
  );
};

const Option = ({
  Icon,
  title,
  selected,
  setSelected,
  open,
  notifs,
  delay,
}) => {
  const router = useRouter();

  const slug = title
    .toLowerCase()
    .replace(/\s&\s/g, "-")
    .replace(/\s/g, "-");

  const handleClick = () => {
    setSelected(title);
    router.push(`/dashboard/${slug}`);
  };

  return (
    <motion.button
      layout
      onClick={handleClick}
      className={`relative flex h-10 w-full items-center rounded-md transition-colrs ${
        selected === title
          ? "bg-white-200/50 text-white-300"
          : "text-slate-500 hover:bg-white-100"
      }`}
    >
      <motion.div
        layout
        className="grid h-full w-10 place-content-center text-lg"
      >
        <Icon />
      </motion.div>
      {open && (
        <motion.span
          layout
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay }}
          className="text-sm font-bold tracking-wide"
        >
          {title}
        </motion.span>
      )}
      {notifs && open && (
        <motion.span
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          style={{ y: "-50%" }}
          className="absolute right-2 top-1/2 size-2 rounded bg-fuchsia-950"
        >
          {notifs}
        </motion.span>
      )}
    </motion.button>
  );
};

const TitleSection = ({ open, username, profileImage }) => {
  const router = useRouter();
  
  const handleClick = () => {
    // Rediriger vers la page principale du dashboard
    router.push('/dashboard');
  };
  return (
    <div className="mb-3 border-b border-slate-400 pb-3" >
      <div
        className="flex cursor-pointer items-center justify-between rounded-md transition-colors
       hover:bg-white-100" onClick={handleClick}
      >
        <div className="flex items-center gap-2">
          <Logo profileImage={profileImage} />
          {open && (
            <motion.div
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.125 }}
            >
              <span className="block text-sm font-semibold">{username}</span>
              <span className="block text-sm text-white-300">Pro Plan</span>
            </motion.div>
          )}
        </div>
        {open && <ChevronDown className="mr-2" />}
      </div>
    </div>
  );
};

const Logo = ({ profileImage }) => {
  const isValidImage = profileImage && profileImage.startsWith('data:image/');
  
  return (
    <motion.div
      layout
      className="grid size-10 shrink-0 place-content-center rounded-md bg-white-200/50"
    >
      {isValidImage ? (
        <img 
          src={profileImage} 
          alt="Profile" 
          className="rounded-full w-8 h-8 object-cover"
        />
      ) : (
        <div className="bg-gray-200 border-2 border-dashed rounded-full w-8 h-8" />
      )}
    </motion.div>
  );
};

const ToggleClose = ({ open, setOpen }) => {
  return (
    <motion.button
      layout
      onClick={() => setOpen((pv) => !pv)}
      className="absolute bottom-0 left-0 right-0 border-t border-slate-300 transition-colors hover:bg-white-100"
    >
      <div className="flex items-center p-2">
        <motion.div
          layout
          className="grid size-10 place-content-center text-lg"
        >
          <ChevronsRight
            className={`transition-transform ${open && "rotate-180"}`}
          />
        </motion.div>
        {open && (
          <motion.span
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.125 }}
            className="text--sm font-bold tracking-wide"
          >
            Hide
          </motion.span>
        )}
      </div>
    </motion.button>
  );
};