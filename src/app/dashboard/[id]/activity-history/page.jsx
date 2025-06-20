// src/app/activity-history/page.jsx
"use client";
import { useEffect, useState } from "react";

const ActivityHistoryPage = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Données simulées pour l'historique d'activités
  const mockActivities = [
    {
      id: 1,
      type: "Connexion",
      details: "Connexion réussie depuis un nouvel appareil",
      status: "success",
      date: "2024-05-15T14:30:00Z",
      ip: "192.168.1.42"
    },
    {
      id: 2,
      type: "Modification",
      details: "Mise à jour des informations de profil",
      status: "success",
      date: "2024-05-14T10:15:00Z",
      ip: "192.168.1.42"
    },
    {
      id: 3,
      type: "Sécurité",
      details: "Changement du mot de passe",
      status: "success",
      date: "2024-05-12T16:45:00Z",
      ip: "192.168.1.42"
    },
    {
      id: 4,
      type: "Paiement",
      details: "Abonnement Premium renouvelé",
      status: "success",
      date: "2024-05-10T09:20:00Z",
      ip: "192.168.1.42"
    },
    {
      id: 5,
      type: "Connexion",
      details: "Tentative de connexion échouée",
      status: "failed",
      date: "2024-05-08T22:10:00Z",
      ip: "203.0.113.25"
    },
    {
      id: 6,
      type: "Notification",
      details: "Paramètres de notification mis à jour",
      status: "success",
      date: "2024-05-05T11:05:00Z",
      ip: "192.168.1.42"
    }
  ];

  useEffect(() => {
    // Simuler un chargement avec délai
    const timer = setTimeout(() => {
      setActivities(mockActivities);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white-50 dark:bg-white-300 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white-200 dark:border-white-100 mx-auto"></div>
          <p className="mt-4 font-geist-mono text-white-200 dark:text-white-100">
            Chargement de l'historique...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white-50 dark:bg-white-300 text-white-300 dark:text-white-100">
      <main className="max-w-4xl mx-auto p-6 pt-12">
        <h1 className="font-dosis text-3xl font-bold mb-8 text-center">
          Historique d'Activité
        </h1>
        
        <div className="bg-white-100 dark:bg-white-200 rounded-xl overflow-hidden border border-white-50 dark:border-white-300">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white-200/50 dark:bg-white-300/50">
                <tr>
                  <th className="text-left py-3 px-4 font-dosis">Type</th>
                  <th className="text-left py-3 px-4 font-dosis">Détails</th>
                  <th className="text-left py-3 px-4 font-dosis">Statut</th>
                  <th className="text-left py-3 px-4 font-dosis">Date</th>
                  <th className="text-left py-3 px-4 font-dosis">IP</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((activity) => (
                  <tr 
                    key={activity.id}
                    className="border-t border-white-50 dark:border-white-300 hover:bg-white-200/10 transition"
                  >
                    <td className="py-3 px-4 font-dosis font-medium">
                      {activity.type}
                    </td>
                    <td className="py-3 px-4 font-geist-mono max-w-xs">
                      {activity.details}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs ${
                        activity.status === 'success' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {activity.status === 'success' ? 'Réussi' : 'Échoué'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-geist-mono whitespace-nowrap">
                      {new Date(activity.date).toLocaleDateString()} à {new Date(activity.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3 px-4 font-geist-mono text-sm">
                      {activity.ip}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 flex justify-between items-center">
          <div className="font-geist-mono text-sm text-white-200 dark:text-white-50">
            Affichage de {activities.length} activités
          </div>
          <div className="flex space-x-2">
            <button className="bg-white-200 text-white-50 px-4 py-2 rounded-lg font-dosis font-bold hover:bg-opacity-90 transition disabled:opacity-50" disabled>
              Précédent
            </button>
            <button className="bg-white-200 text-white-50 px-4 py-2 rounded-lg font-dosis font-bold hover:bg-opacity-90 transition">
              Suivant
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ActivityHistoryPage;