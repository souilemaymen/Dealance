// app/forgot-password/page.jsx
"use client";
import { useState } from "react";
import { Mail } from "lucide-react";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      
      if (res.ok) {
        setMessage({ 
          text: "Un email de réinitialisation a été envoyé à votre adresse.", 
          type: "success" 
        });
        setEmail("");
      } else {
        const errorData = await res.json();
        setMessage({ 
          text: errorData.error || "Erreur lors de l'envoi de l'email", 
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-white-50">
      <div className="bg-white-100 p-8 rounded-2xl shadow-xl max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <div className="mx-auto bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <Mail className="text-blue-500" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white-300 font-dosis">
            Mot de passe oublié
          </h1>
          <p className="text-white-200 font-geist-mono mt-2">
            Entrez votre email pour réinitialiser votre mot de passe
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white-200 font-geist-mono mb-2">
              Adresse email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-white-200 focus:outline-none focus:ring-1 focus:ring-white-200 bg-white-50 text-white-300 font-geist-mono"
              placeholder="votre@email.com"
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
            {isLoading ? "Envoi en cours..." : "Envoyer le lien de réinitialisation"}
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

export default ForgotPasswordPage;