// app/reset-password/page.jsx
"use client";
import { useState } from "react";
import { useSearchParams } from 'next/navigation';
import { Lock, Eye, EyeOff } from "lucide-react";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setMessage({ text: "Les mots de passe ne correspondent pas", type: "error" });
      return;
    }
    
    if (password.length < 6) {
      setMessage({ text: "Le mot de passe doit contenir au moins 6 caractères", type: "error" });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password })
      });
      
      if (res.ok) {
        setMessage({ 
          text: "Mot de passe réinitialisé avec succès! Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.", 
          type: "success" 
        });
        setPassword("");
        setConfirmPassword("");
      } else {
        const errorData = await res.json();
        setMessage({ 
          text: errorData.error || "Erreur lors de la réinitialisation", 
          type: "error" 
        });
      }
    } catch (error) {
      setMessage({ 
        text: "Erreur réseau", 
        type: "error" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white-50">
        <div className="bg-white-100 p-8 rounded-2xl shadow-xl max-w-md w-full mx-4">
          <div className="text-center">
            <div className="mx-auto bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Lock className="text-red-500" size={32} />
            </div>
            <h1 className="text-2xl font-bold text-white-300 font-dosis mb-2">
              Lien invalide
            </h1>
            <p className="text-white-200 font-geist-mono mb-6">
              Ce lien de réinitialisation est invalide ou a expiré.
            </p>
            <a 
              href="/forgot-password" 
              className="inline-block bg-white-200 text-white-50 px-6 py-3 rounded-lg hover:bg-opacity-90 transition font-dosis font-bold"
            >
              Demander un nouveau lien
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white-50">
      <div className="bg-white-100 p-8 rounded-2xl shadow-xl max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <div className="mx-auto bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <Lock className="text-blue-500" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white-300 font-dosis">
            Réinitialiser votre mot de passe
          </h1>
          <p className="text-white-200 font-geist-mono mt-2">
            Entrez votre nouveau mot de passe ci-dessous
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white-200 font-geist-mono mb-2">
              Nouveau mot de passe
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-white-200 focus:outline-none focus:ring-1 focus:ring-white-200 bg-white-50 text-white-300 font-geist-mono"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white-200 hover:text-white-300"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white-200 font-geist-mono mb-2">
              Confirmer le nouveau mot de passe
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-white-200 focus:outline-none focus:ring-1 focus:ring-white-200 bg-white-50 text-white-300 font-geist-mono"
              placeholder="••••••••"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-lg transition font-dosis font-bold ${
              isLoading 
                ? "bg-white-200 text-white-50 cursor-not-allowed opacity-70" 
                : "bg-white-200 text-white-50 hover:bg-opacity-90"
            }`}
          >
            {isLoading ? "Réinitialisation en cours..." : "Réinitialiser le mot de passe"}
          </button>
          
          {message.text && (
            <div className={`p-4 rounded-lg font-geist-mono ${
              message.type === "success" 
                ? "bg-green-100 text-green-800" 
                : "bg-red-100 text-red-800"
            }`}>
              {message.text}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;