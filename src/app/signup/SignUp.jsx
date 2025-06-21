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

const SignUp = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState({});
  // code de  handlesignup
  const handleSignUp = async () => {
    let newErrors = {};

    if (!fullName) {
      newErrors.fullName = "Full Name is required";
    } else if (!email) {
      newErrors.email = "Email is required";
    } else if (!password) {
      newErrors.password = "Password is required";
    } else if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm Password is required";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }else if (!phoneNumber){
      newErrors.phoneNumber = "Phone number is required "; 
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0 && isChecked) {
      try {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ fullName, email , phoneNumber , password }),
          credentials: "include",
        });

        const text = await res.text(); 
        console.log("Réponse brute :", text);

        let data;
        try {
          data = JSON.parse(text);
        } catch (err) {
          console.error("Erreur de parsing JSON :", err);
          alert("La réponse du serveur n'est pas au format JSON.");
          return;
        }

        console.log("JSON parsé :", data);

        if (res.ok) {
          console.log("sigup réussi :", data.token);
          router.push("/signup/steps");
        } else {
          alert(data.message || "Sign up failed");
        }
      } catch (err) {
        console.error("Sign up error:", err);
        alert("An error occurred during signup.");
      }
    }
  };

  // end code handle signup
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
            Create Your Account
          </motion.h2>
          <motion.p
            className="text-white-50 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Sign up to explore endless possibiblities
          </motion.p>

          <div className="space-y-4">
            <motion.input
              type="text"
              placeholder="Full Name"
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-1 focus:ring-white-100 tracking-wide"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.6 }}
            />
            {errors.fullName && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-red-700 font-bold tracking-wider text-sm"
              >
                {errors.fullName}
              </motion.p>
            )}
            <motion.input
              type="email"
              placeholder="Email Address"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-1 focus:ring-white-100 tracking-wide"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                delay: 0.8,
              }}
            />
            <motion.input // command 
              type="number"
              placeholder="Phone Number"
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-1 focus:ring-white-100 tracking-wide no-spinner"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                delay: 1,
              }}
            />
            <motion.div className="relative w-full">
              <motion.input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-1 focus:ring-white-100 tracking-wide"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 1.2 }}
              />
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-red-700 font-bold tracking-wider text-sm"
                >
                  {errors.password}
                </motion.p>
              )}
              <motion.button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3 text-gray-500 hover:text-gray-700"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 1.2 }}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </motion.button>
            </motion.div>
            <motion.div className="relative w-full">
              <motion.input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-1 focus:ring-white-100 tracking-wide"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 1.4 }}
              />
              {errors.confirmPassword && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-red-700 font-bold tracking-wider text-sm"
                >
                  {errors.confirmPassword}
                </motion.p>
              )}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 1.4 }}
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-3 text-gray-500 hover:text-gray-700"
              >
                <FontAwesomeIcon
                  icon={showConfirmPassword ? faEyeSlash : faEye}
                />
              </motion.button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.6 }}
              className="flex item-center text-white-50 text-sm gap-2 mt-4"
            >
              <input
                type="checkbox"
                id="privacyPolicy"
                className="w-4 h-4 accent-white-100"
                onChange={(e) => setIsChecked(e.target.checked)}
              />
              <label htmlFor="" className="cursor-pointer">
                I agree to the{" "}
                <a
                  href=""
                  className="text-white-100 font-semibold ml-1 hover:underline"
                >
                  Privacy Policy{" "}
                </a>
                and
                <a
                  href=""
                  className="text-white-100 font-semibold ml-1 hover:underline"
                >
                  Terms of Services
                </a>
              </label>
            </motion.div>
            <motion.button
              id="signUpButton"
              /*onClick={() => {handleSignUp}(); router.push("/dashboard")}}*/
              onClick={handleSignUp}
              className="w-1/2 bg-white-200 text-white-50 py-3 rounded-lg hover:bg-white-300 transition font-semibold tracking-wider"
              whileHover={isChecked ? { scale: 1.05, rotate: 1 } : {}}
              whileTap={isChecked ? { scale: 0.95 } : {}}
              disabled={!isChecked}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.8 }}
            >
              Sign Up
            </motion.button>
          </div>

          <motion.div
            className="my-4 flex items-center justify-center gap-2 text-white-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 2 }}
          >
            <div className="h-px w-20 bg-white-300"></div>
            <span>OR</span>
            <div className="h-px w-20 bg-white-300"></div>
          </motion.div>

          {/* <div className="flex justify-center gap-4">
            <motion.button
              className="flex items-center gap-2 px-4 py-3 border rounded-lg hover:bg-white-50 transition"
              whileHover={{ scale: 1.08, rotate: 2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, duration: 0.5 }}
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
          </div> */}

          <motion.div
            className="mt-6 text-white-50"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 2.2 }}
          >
            Already have an account ?
            <button
              className="text-white-100 font-semibold ml-1 hover:underline"
              onClick={() => router.push("/login")}
            >
              Login
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default SignUp;