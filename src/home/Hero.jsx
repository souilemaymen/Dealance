"use client";
import Button from "@/components/Button";
import { Spotlight } from "@/components/Spotlight";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const Hero = () => {
  const router = useRouter();

  return (
    <section className="container overflow-hidden ">
      <Spotlight />
      <div className="flex flex-col items-center justify-center h-screen text-center px-4 space-y-10">
        <motion.h2
          className="~text-4xl/7xl relative z-20 font-bold text-center tracking-wider"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          Empowering Tunisian Freelancers
        </motion.h2>
        <motion.div
          className="relative mx-auto inline-block w-max [filter:drop-shadow(0px_1px_3px_rgba(27,_37,_80,_0.14))]"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
        >
          <motion.div
            className="absolute left-0 top-[1px] bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r from-[#e7e3f1] via-[#826fae] to-[#5c4d7c] [text-shadow:0_0_rgba(0,0,0,0.1)] py-4 ~text-2xl/6xl tracking-wide"
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
          >
            <span>Your Gateway to Success</span>
          </motion.div>
          <motion.div
            className="relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-[#e7e3f1] via-[#826fae] to-[#5c4d7c] py-4 ~text-2xl/6xl tracking-wide"
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
          >
            <div>
              <span>Your Gateway to Success</span>
            </div>
          </motion.div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 1.5, ease: "easeOut" }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="flex space-x-10"
        >
          <Button
            onClick={() => router.push("/signup")}
            className="text-white-300 font-semibold"
          >
            Sign up
          </Button>
          <Button
            onClick={() => router.push("/login")}
            className="text-white-300 font-semibold"
          >
            LogIn
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
