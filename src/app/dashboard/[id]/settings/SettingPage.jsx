// src/app/settings/page.jsx
"use client";
import { useEffect,useState } from "react";
import { Check, X, Eye, EyeOff, Bell, BellOff, Mail } from "lucide-react";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("account");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "••••••••",
    linkedin: "",
    github: "",
    portfolio: "",
    otherLink: "",
    notifications: {
      email: true,
      push: false,
      newsletter: true
    }
  });
  const [saved, setSaved] = useState(false);
  const [userType, setUserType] = useState("");
  const [loading, setLoading] = useState(true);

  // Récupération des données utilisateur
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/user/settings");
        const userData = await res.json();
        
        if (res.ok) {
          setFormData(prev => ({
            ...prev,
            fullName: userData.fullName || "",
            email: userData.email || "",
            phone: userData.phoneNumber || "",
            linkedin: userData.linkedin || "",
            github: userData.github || "",
            portfolio: userData.portfolio || "",
            otherLink: userData.otherLink || ""
          }));
          
          setUserType(userData.userType);
        }
      } catch (error) {
        console.error("Erreur récupération données utilisateur:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === "checkbox" ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value
      }));
    }
    
    setSaved(false);
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch("/api/user/settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          phoneNumber: formData.phone,
          linkedin: formData.linkedin,
          github: formData.github,
          portfolio: formData.portfolio,
          otherLink: formData.otherLink
        })
      });

      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        const errorData = await response.json();
        console.error("Erreur mise à jour:", errorData);
      }
    } catch (error) {
      console.error("Erreur réseau:", error);
    }
  };
if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white-200"></div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-white-50 dark:bg-white-300 text-white-300 dark:text-white-100">
      <main className="max-w-4xl mx-auto p-6 pt-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="font-dosis text-3xl font-bold mb-4 md:mb-0">
            Paramètres du compte
          </h1>
          {saved && (
            <div className="flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-lg">
              <Check className="mr-2" size={20} />
              <span className="font-geist-mono">Modifications enregistrées</span>
            </div>
          )}
        </div>

        {/* Navigation par onglets */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-white-100 dark:border-white-200">
          {[
            { id: "account", label: "Informations du compte" },
            { id: "security", label: "Sécurité" },
            { id: "notifications", label: "Notifications" },
            { id: "privacy", label: "Confidentialité" }
          ].map((tab) => (
            <button
              key={tab.id}
              className={`px-4 py-2 rounded-t-lg font-dosis font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-white-200 text-white-50"
                  : "text-white-200 hover:bg-white-100"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Formulaire - Informations du compte */}
        {activeTab === "account" && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white-100 dark:bg-white-200 rounded-xl p-6 border border-white-50 dark:border-white-300">
              <h2 className="font-dosis text-xl font-bold mb-6">
                Informations personnelles
              </h2>
              
              <div className="grid grid-cols-1 gap-6">
                {/* Champ unique pour le nom complet */}
                <div>
                  <label className="block font-geist-mono text-sm mb-2">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-white-50 dark:bg-white-100 border border-white-100 dark:border-white-300 focus:outline-none focus:ring-1 focus:ring-white-200"
                  />
                </div>
                
                <div>
                  <label className="block font-geist-mono text-sm mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-white-50 dark:bg-white-100 border border-white-100 dark:border-white-300 focus:outline-none focus:ring-1 focus:ring-white-200"
                  />
                </div>
                
                <div>
                  <label className="block font-geist-mono text-sm mb-2">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-white-50 dark:bg-white-100 border border-white-100 dark:border-white-300 focus:outline-none focus:ring-1 focus:ring-white-200"
                  />
                </div>
                          {userType === "freelancer" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-geist-mono text-sm mb-2">
                    LinkedIn
                  </label>
                  <input
                    type="url"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full px-4 py-3 rounded-lg bg-white-50 dark:bg-white-100 border border-white-100 dark:border-white-300 focus:outline-none focus:ring-1 focus:ring-white-200"
                  />
                </div>
                <div>
                  <label className="block font-geist-mono text-sm mb-2">
                    GitHub
                  </label>
                  <input
                    type="url"
                    name="github"
                    value={formData.github}
                    onChange={handleChange}
                    placeholder="https://github.com/username"
                    className="w-full px-4 py-3 rounded-lg bg-white-50 dark:bg-white-100 border border-white-100 dark:border-white-300 focus:outline-none focus:ring-1 focus:ring-white-200"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-geist-mono text-sm mb-2">
                    Portfolio
                  </label>
                  <input
                    type="url"
                    name="portfolio"
                    value={formData.portfolio}
                    onChange={handleChange}
                    placeholder="https://votreportfolio.com"
                    className="w-full px-4 py-3 rounded-lg bg-white-50 dark:bg-white-100 border border-white-100 dark:border-white-300 focus:outline-none focus:ring-1 focus:ring-white-200"
                  />
                </div>
                <div>
                  <label className="block font-geist-mono text-sm mb-2">
                    Autre lien
                  </label>
                  <input
                    type="url"
                    name="otherLink"
                    value={formData.otherLink}
                    onChange={handleChange}
                    placeholder="https://autre-lien.com"
                    className="w-full px-4 py-3 rounded-lg bg-white-50 dark:bg-white-100 border border-white-100 dark:border-white-300 focus:outline-none focus:ring-1 focus:ring-white-200"
                  />
                </div>
              </div>
            </>
          )}
        </div>
        
        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            className="bg-white-200 text-white-50 px-6 py-3 rounded-full font-dosis font-bold hover:bg-opacity-90 transition"
          >
            Enregistrer les modifications
          </button>
        </div>
      </div>
    </form>
  )}
        {/* Sécurité */}
        {activeTab === "security" && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white-100 dark:bg-white-200 rounded-xl p-6 border border-white-50 dark:border-white-300">
              <h2 className="font-dosis text-xl font-bold mb-6">
                Sécurité du compte
              </h2>
              
              <div className="mb-6">
                <label className="block font-geist-mono text-sm mb-2">
                  Mot de passe actuel
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="currentPassword"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-white-50 dark:bg-white-100 border border-white-100 dark:border-white-300 focus:outline-none focus:ring-1 focus:ring-white-200 pr-12"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white-200"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block font-geist-mono text-sm mb-2">
                    Nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    className="w-full px-4 py-3 rounded-lg bg-white-50 dark:bg-white-100 border border-white-100 dark:border-white-300 focus:outline-none focus:ring-1 focus:ring-white-200"
                  />
                </div>
                
                <div>
                  <label className="block font-geist-mono text-sm mb-2">
                    Confirmer le nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    className="w-full px-4 py-3 rounded-lg bg-white-50 dark:bg-white-100 border border-white-100 dark:border-white-300 focus:outline-none focus:ring-1 focus:ring-white-200"
                  />
                </div>
              </div>
              
              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  className="bg-white-200 text-white-50 px-6 py-3 rounded-full font-dosis font-bold hover:bg-opacity-90 transition"
                >
                  Mettre à jour le mot de passe
                </button>
              </div>
            </div>
            
            <div className="bg-white-100 dark:bg-white-200 rounded-xl p-6 border border-white-50 dark:border-white-300">
              <h2 className="font-dosis text-xl font-bold mb-6">
                Authentification à deux facteurs
              </h2>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-dosis font-bold">Vérification en 2 étapes</h3>
                  <p className="font-geist-mono text-sm mt-1">
                    Ajoutez une couche de sécurité supplémentaire à votre compte
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-white-100 dark:bg-white-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-white-200"></div>
                </label>
              </div>
            </div>
          </form>
        )}

        {/* Notifications */}
        {activeTab === "notifications" && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white-100 dark:bg-white-200 rounded-xl p-6 border border-white-50 dark:border-white-300">
              <h2 className="font-dosis text-xl font-bold mb-6">
                Préférences de notification
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-white-50 dark:bg-white-100">
                  <div className="flex items-center">
                    <Mail className="mr-3 text-white-200" size={20} />
                    <div>
                      <h3 className="font-dosis font-bold">Notifications par email</h3>
                      <p className="font-geist-mono text-sm">
                        Recevez des notifications importantes par email
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="notifications.email"
                      checked={formData.notifications.email}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-white-100 dark:bg-white-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-white-200"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-lg bg-white-50 dark:bg-white-100">
                  <div className="flex items-center">
                    <Bell className="mr-3 text-white-200" size={20} />
                    <div>
                      <h3 className="font-dosis font-bold">Notifications push</h3>
                      <p className="font-geist-mono text-sm">
                        Recevez des notifications sur votre appareil
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="notifications.push"
                      checked={formData.notifications.push}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-white-100 dark:bg-white-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-white-200"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-lg bg-white-50 dark:bg-white-100">
                  <div className="flex items-center">
                    <Mail className="mr-3 text-white-200" size={20} />
                    <div>
                      <h3 className="font-dosis font-bold">Lettre d'information</h3>
                      <p className="font-geist-mono text-sm">
                        Recevez des actualités et des offres spéciales
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="notifications.newsletter"
                      checked={formData.notifications.newsletter}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-white-100 dark:bg-white-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-white-200"></div>
                  </label>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  className="bg-white-200 text-white-50 px-6 py-3 rounded-full font-dosis font-bold hover:bg-opacity-90 transition"
                >
                  Enregistrer les préférences
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Confidentialité */}
        {activeTab === "privacy" && (
          <div className="space-y-6">
            <div className="bg-white-100 dark:bg-white-200 rounded-xl p-6 border border-white-50 dark:border-white-300">
              <h2 className="font-dosis text-xl font-bold mb-6">
                Paramètres de confidentialité
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-white-50 dark:bg-white-100">
                  <div>
                    <h3 className="font-dosis font-bold">Profil public</h3>
                    <p className="font-geist-mono text-sm">
                      Autoriser les autres utilisateurs à voir votre profil
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-white-100 dark:bg-white-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-white-200"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-lg bg-white-50 dark:bg-white-100">
                  <div>
                    <h3 className="font-dosis font-bold">Partage de données</h3>
                    <p className="font-geist-mono text-sm">
                      Autoriser le partage de données avec des partenaires
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-white-100 dark:bg-white-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-white-200"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-lg bg-white-50 dark:bg-white-100">
                  <div>
                    <h3 className="font-dosis font-bold">Analyse d'utilisation</h3>
                    <p className="font-geist-mono text-sm">
                      Autoriser la collecte de données d'utilisation
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-white-100 dark:bg-white-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-white-200"></div>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="bg-white-100 dark:bg-white-200 rounded-xl p-6 border border-white-50 dark:border-white-300">
              <h2 className="font-dosis text-xl font-bold mb-6">
                Téléchargement de données
              </h2>
              
              <p className="font-geist-mono mb-6">
                Vous pouvez télécharger une copie de vos données personnelles au format JSON.
              </p>
              
              <button className="bg-white-200 text-white-50 px-6 py-3 rounded-full font-dosis font-bold hover:bg-opacity-90 transition">
                Télécharger mes données
              </button>
            </div>
            
            <div className="bg-white-100 dark:bg-white-200 rounded-xl p-6 border border-white-50 dark:border-white-300">
              <h2 className="font-dosis text-xl font-bold mb-6">
                Suppression du compte
              </h2>
              
              <p className="font-geist-mono mb-6 text-red-500">
                Attention : Cette action est irréversible. Toutes vos données seront supprimées définitivement.
              </p>
              
              <button className="bg-red-500 text-white-50 px-6 py-3 rounded-full font-dosis font-bold hover:bg-opacity-90 transition flex items-center">
                <X className="mr-2" size={20} />
                Supprimer mon compte
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SettingsPage;
