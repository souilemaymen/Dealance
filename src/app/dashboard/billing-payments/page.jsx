// src/app/billing-payment/page.jsx
"use client";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const BillingPaymentPage = () => {
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const mockSubscriptions = [
    {
      id: "sub_123",
      name: "Abonnement Pro",
      status: "active",
      price: 19.99,
      startDate: "2024-01-15T00:00:00Z",
      renewalDate: "2024-07-15T00:00:00Z",
      payments: [
        {
          date: "2024-01-15T00:00:00Z",
          amount: 19.99,
          status: "completed"
        },
        {
          date: "2024-02-15T00:00:00Z",
          amount: 19.99,
          status: "completed"
        },
        {
          date: "2024-03-15T00:00:00Z",
          amount: 19.99,
          status: "completed"
        }
      ]
    },
    {
      id: "sub_456",
      name: "Abonnement Premium",
      status: "active",
      price: 29.99,
      startDate: "2024-03-01T00:00:00Z",
      renewalDate: "2024-09-01T00:00:00Z",
      payments: [
        {
          date: "2024-03-01T00:00:00Z",
          amount: 29.99,
          status: "completed"
        }
      ]
    }
  ];

  useEffect(() => {
    // Simuler un chargement avec délai
    const timer = setTimeout(() => {
      setSubscriptions(mockSubscriptions);
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
            Chargement des abonnements...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white-50 dark:bg-white-300 text-white-300 dark:text-white-100">


      {/* Contenu principal */}
      <main className="max-w-4xl mx-auto p-6">
        <h1 className="font-dosis text-3xl font-bold mb-8 text-center">
          Vos Abonnements
        </h1>

        {subscriptions.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white-100 dark:bg-white-200 rounded-lg p-8 inline-block">
              <p className="font-geist-mono text-lg mb-4">
                Vous n'avez aucun abonnement actif
              </p>
              <button
                onClick={() => router.push("/subscriptions")}
                className="bg-white-200 text-white-50 px-6 py-3 rounded-full font-dosis font-bold hover:bg-opacity-90 transition"
              >
                Explorer les abonnements
              </button>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {subscriptions.map((subscription) => (
              <div 
                key={subscription.id}
                className="bg-white-100 dark:bg-white-200 rounded-xl p-6 border border-white-50 dark:border-white-300 shadow-sm"
              >
                <div className="flex justify-between items-start mb-4">
                  <h2 className="font-dosis text-xl font-bold">
                    {subscription.name}
                  </h2>
                  <span className={`px-3 py-1 rounded-full text-xs font-geist-mono ${
                    subscription.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : subscription.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                  }`}>
                    {subscription.status === 'active' ? 'Actif' : 
                     subscription.status === 'pending' ? 'En attente' : 'Inactif'}
                  </span>
                </div>

                <div className="mb-4">
                  <p className="font-geist-mono flex justify-between">
                    <span>Prix:</span>
                    <span className="font-bold">{subscription.price}€/mois</span>
                  </p>
                  <p className="font-geist-mono flex justify-between">
                    <span>Début:</span>
                    <span>{new Date(subscription.startDate).toLocaleDateString()}</span>
                  </p>
                  <p className="font-geist-mono flex justify-between">
                    <span>Renouvellement:</span>
                    <span>{new Date(subscription.renewalDate).toLocaleDateString()}</span>
                  </p>
                </div>

                <div className="mt-6 space-y-3">
                  <button className="w-full bg-white-200 text-white-50 py-2 rounded-lg font-dosis font-bold hover:bg-opacity-90 transition">
                    Gérer l'abonnement
                  </button>
                  <button className="w-full border border-white-200 text-white-200 py-2 rounded-lg font-dosis hover:bg-white-200/10 transition">
                    Voir les détails
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Section d'historique */}
        {subscriptions.length > 0 && (
          <div className="mt-12">
            <h2 className="font-dosis text-2xl font-bold mb-4">Historique des paiements</h2>
            <div className="bg-white-100 dark:bg-white-200 rounded-xl overflow-hidden border border-white-50 dark:border-white-300">
              <table className="w-full">
                <thead className="bg-white-200/50 dark:bg-white-300/50">
                  <tr>
                    <th className="text-left py-3 px-4 font-dosis">Date</th>
                    <th className="text-left py-3 px-4 font-dosis">Montant</th>
                    <th className="text-left py-3 px-4 font-dosis">Statut</th>
                    <th className="text-left py-3 px-4 font-dosis">Facture</th>
                  </tr>
                </thead>
                <tbody>
                  {subscriptions.flatMap(sub => sub.payments).map((payment, index) => (
                    <tr key={index} className="border-t border-white-50 dark:border-white-300">
                      <td className="py-3 px-4 font-geist-mono">
                        {new Date(payment.date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 font-geist-mono">{payment.amount}€</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          payment.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : payment.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                        }`}>
                          {payment.status === 'completed' ? 'Complété' : 
                           payment.status === 'pending' ? 'En attente' : 'Échoué'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button className="text-white-200 dark:text-white-50 hover:underline font-geist-mono text-sm">
                          Télécharger
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default BillingPaymentPage;