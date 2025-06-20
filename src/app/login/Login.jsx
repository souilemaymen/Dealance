"use client";
import { faFacebook, faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { SparklesCore } from "@/components/Sparkles";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { useRouter } from "next/navigation";

const SparklesWrapper = React.memo(() => {
  return (
    <div className="w-full absolute h-screen">
      <SparklesCore
        background="transparent"
        minSize={0.6}
        maxSize={1.4}
        className="w-full h-full"
        particleColor="#302546"
      />
    </div>
  );
});

const Login = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // code handleSignin
  const handleLogin = async () => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      // Lecture unique du corps en texte pour debug
      const text = await res.text();
      console.log("Réponse brute du serveur:", text);

      // Convertir en JSON (parse) manuellement
      let data;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        alert("Erreur lors de la lecture de la réponse du serveur.");
        console.error("Erreur JSON:", parseError);
        return;
      }

      if (res.ok) {
        console.log("Login réussi :", data.token);
        //localStorage.setItem("token", data.token);
        //localStorage.setItem("userId", data.user._id);
        router.push("/Acceuil");
        // router.push(`/dashboard/${data.user._id}`);  // redirection personnalisée
      } else {
        alert(data.message || "Erreur lors de la connexion");
      }
    } catch (err) {
      console.error("Erreur lors du login", err);
      alert("Une erreur est survenue, veuillez réessayer.");
    }
  };
  // end code handlelogin
  return (
    <section>
      <div className="flex justify-center items-center min-h-screen px-4 relative">
        <SparklesWrapper />
        <motion.div
          className="bg-white-200 shadow-2xl shadow-white-300 rounded-2xl p-8 max-w-md w-full text-center relative z-20"
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.h2
            className="text-3xl font-bold text-white-50 mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Welcome Back
          </motion.h2>
          <motion.p
            className="text-white-50 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Login to continue your journey
          </motion.p>

          <div className="space-y-4">
            <motion.input
              type="email"
              value={email} //connection with the input of password
              onChange={(e) => setEmail(e.target.value)} // connection of the function password
              placeholder="Email Address"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-1 focus:ring-white-100 tracking-wide"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                delay: 0.4,
              }}
            />
            <motion.div className="relative w-full">
              <motion.input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password} // connection with password
                onChange={(e) => setPassword(e.target.value)} // connection with the function of password
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-1 focus:ring-white-100 tracking-wide"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3 text-gray-500 hover:text-gray-700"
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </motion.div>

            <motion.button
              id="loginButton"
              className="w-1/2 bg-white-200 text-white-50 py-3 rounded-lg hover:bg-white-300 transition font-semibold tracking-wider"
              whileHover={{ scale: 1.05, rotate: 1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
              onClick={handleLogin}
            >
              Login
            </motion.button>
          </div>

          <div className="my-4 flex items-center justify-center gap-2 text-white-50">
            <div className="h-px w-20 bg-white-300"></div>
            <span>OR</span>
            <div className="h-px w-20 bg-white-300"></div>
          </div>

          <div className="flex justify-center gap-4">
            <motion.button
              className="flex items-center gap-2 px-4 py-3 border rounded-lg hover:bg-white-50 transition"
              whileHover={{ scale: 1.08, rotate: 2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <FontAwesomeIcon icon={faGoogle} className="text-2xl" /> Google
            </motion.button>
            <motion.button
              className="flex items-center gap-2 px-4 py-3 border rounded-lg hover:bg-white-50 transition"
              whileHover={{ scale: 1.08, rotate: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <FontAwesomeIcon icon={faFacebook} className="text-2xl" />{" "}
              Facebook
            </motion.button>
          </div>

          <motion.div
            className="mt-6 text-white-50"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            Don't have an account ?
            <button
              className="text-white-100 font-semibold ml-1 hover:underline"
              onClick={() => router.push("/signup")}
            >
              Sign Up
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Login;
