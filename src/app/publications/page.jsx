"use client";
import React, { useState, useEffect } from 'react';
import NavbarMenuAcceuil from '@/components/NavbarMenuAcceuil';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const PublicationsPage = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const [showModal, setShowModal] = useState(false);
    const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
    const [showContactSubscriptionModal, setShowContactSubscriptionModal] = useState(false);
    const [showContactModal, setShowContactModal] = useState(false);
    const [selectedPublication, setSelectedPublication] = useState(null);
    const [publications, setPublications] = useState([]);
    const [newPublication, setNewPublication] = useState({
        content: '',
        tags: [],
        tagInput: '',
        media: null,
        mediaFile: null,
        budget: ''
    });
    const [contactMessage, setContactMessage] = useState('');
    const [isSendingMessage, setIsSendingMessage] = useState(false);
    const [messageSent, setMessageSent] = useState(false);

    useEffect(() => {
        const fetchPublications = async () => {
            try {
                const response = await fetch('/api/publications');
                if (response.ok) {
                    const data = await response.json();
                    setPublications(data);
                } else {
                    console.error('Failed to fetch publications');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchPublications();
    }, []);
    
    const subscriptionBadges = {
        Null: null,
        Basique: { 
            text: "Basique", 
            color: "bg-blue-500/10 text-blue-500" 
        },
        Pro: { 
            text: "Pro", 
            color: "bg-gray-400/10 text-gray-400" 
        },
        Elite: { 
            text: "Elite", 
            color: "bg-yellow-600/10 text-yellow-600" 
        }
    };

    const stats = [
        { label: "Projets", value: 12 },
        { label: "Heures", value: 84 },
        { label: "Tâches", value: 37 },
    ];
    
    const openModal = () => {
        if (session?.user?.userType === 'freelancer' && !session?.user?.hasSubscription) {
            setShowSubscriptionModal(true);
        } else {
            setShowModal(true);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setNewPublication({ 
            content: '', 
            tags: [], 
            tagInput: '', 
            media: null,
            budget: '' 
        });
    };

    const closeSubscriptionModal = () => setShowSubscriptionModal(false);
    const closeContactSubscriptionModal = () => setShowContactSubscriptionModal(false);
    const closeContactModal = () => {
        setShowContactModal(false);
        setContactMessage('');
        setMessageSent(false);
    };
    
    const goToSubscriptionPage = () => {
        router.push('/abonnement');
        closeSubscriptionModal();
        closeContactSubscriptionModal();
    };

    const checkUserSubscription = async (userId) => {
        if (!userId) {
            console.error("ID utilisateur non fourni");
            return false;
        }
        
        try {
            const response = await fetch('/api/subscription/check', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId }),
                credentials: 'include',
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Erreur serveur: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            return data.hasValidSubscription;
        } catch (error) {
            console.error('Error checking subscription:', error);
            return false;
        }
    };

    const handleContact = async (publication) => {
        setSelectedPublication(publication);
        
        if (!session) {
            alert("Veuillez vous connecter pour contacter un professionnel");
            return;
        }

        const userId = session.userId;
        
        if (!userId) {
            alert("Erreur d'identification. Veuillez vous reconnecter.");
            return;
        }

        try {
            const response = await fetch('/api/subscription/check', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId }),
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la vérification de l\'abonnement');
            }

            const data = await response.json();
            
            if (data.hasValidSubscription) {
                setShowContactModal(true);
            } else {
                setShowContactSubscriptionModal(true);
            }
        } catch (error) {
            console.error("Erreur lors de la vérification de l'abonnement:", error);
            setShowContactSubscriptionModal(true);
        }
    };
    
    const sendContactMessage = async (e) => {
        e.preventDefault();
        setIsSendingMessage(true);
        
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            setMessageSent(true);
            
            setTimeout(() => {
                setMessageSent(false);
                setContactMessage('');
                closeContactModal();
            }, 2000);
        } catch (error) {
            console.error("Erreur lors de l'envoi du message:", error);
        } finally {
            setIsSendingMessage(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewPublication({ ...newPublication, [name]: value });
    };

    const addTag = () => {
        if (newPublication.tagInput.trim() && newPublication.tags.length < 5) {
            setNewPublication({
                ...newPublication,
                tags: [...newPublication.tags, newPublication.tagInput.trim()],
                tagInput: ''
            });
        }
    };

    const removeTag = (index) => {
        const newTags = [...newPublication.tags];
        newTags.splice(index, 1);
        setNewPublication({ ...newPublication, tags: newTags });
    };

    const submitPublication = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append('content', newPublication.content);
            formData.append('budget', newPublication.budget);
            formData.append('tags', JSON.stringify(newPublication.tags));

            if (newPublication.mediaFile) {
                formData.append('media', newPublication.mediaFile);
            }

            const response = await fetch('/api/publications', {
                method: 'POST',
                body: formData,
                credentials: 'include',
            });

            if (!response.ok) {
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Erreur lors de la publication");
                } else {
                    const text = await response.text();
                    throw new Error(`Erreur serveur: ${text}`);
                }
            }

            const res = await fetch('/api/publications');
            if (res.ok) {
                const updatedPublications = await res.json();
                setPublications(updatedPublications);
            } else {
                console.error('Failed to reload publications');
            }
            
            closeModal();
        } catch (error) {
            console.error('Erreur:', error);
            alert(error.message);
        }
    };

    const handleMediaChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setNewPublication({ 
                ...newPublication, 
                media: URL.createObjectURL(e.target.files[0]),
                mediaFile: e.target.files[0] 
            });
        }
    };
    
    const handleSubscriptionSelect = async (type) => {
        try {
            const response = await fetch('/api/subscription/demandes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ subscriptionType: type })
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Demande créée:", data.demandeId);
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || "Erreur lors de la création");
            }
        } catch (error) {
            console.error("Erreur:", error);
            alert(error.message);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <NavbarMenuAcceuil />
            <div className="h-16 md:h-20"></div>
            
            <div className="flex-grow bg-white-50 dark:bg-white-300 transition-colors duration-300">
                <div className="overflow-hidden py-4 bg-white-100 dark:bg-white-200">
                    <div 
                        className="animate-scroll whitespace-nowrap"
                        style={{ '--animation-duration': '30s' }}
                    >
                        {[...Array(8)].map((_, i) => (
                            <span key={`scroll-${i}`} className="mx-8 text-xl font-dosis font-bold text-white-200 dark:text-white-50">
                                Actualités • Publications • Projets • Réalisations • Conseils •
                            </span>
                        ))}
                    </div>
                </div>

                <div className="container mx-auto px-4 py-8 max-w-3xl">
                    <div className="mb-8 flex justify-start">
                        <button 
                            onClick={openModal}
                            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white-50 font-dosis font-bold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl group"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 transition-transform group-hover:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            <span className="group-hover:tracking-wider transition-all">Créer une publication</span>
                        </button>
                    </div>
                    <div className="space-y-6">
                        {publications.map((pub) => {
                            const isCurrentUser = session?.userId === pub.userId?._id;
                            
                            return (
                                <div key={pub._id} className="bg-white-100 dark:bg-white-200 rounded-xl shadow-lg overflow-hidden transition-all duration-300">
                                    <div className="p-6 border-b border-white-200 dark:border-white-100">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4">
                                                {pub.userId?.profileImage ? (
                                                    <img 
                                                        src={pub.userId.profileImage} 
                                                        alt="Profile"
                                                        className="w-12 h-12 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-12 h-12 rounded-full bg-white-300 dark:bg-white-100"></div>
                                                )}
                                                <div>
                                                    <button 
                                                        onClick={() => router.push(`/profil/${pub.userId?._id}`)}
                                                        className="font-dosis font-bold text-white-300 dark:text-white-50 hover:underline focus:outline-none text-left"
                                                    >
                                                        {pub.userId?.fullName || 'Utilisateur inconnu'}
                                                    </button>
                                                    <p className="text-sm font-geist-mono text-white-200 dark:text-white-100">
                                                        {pub.userId?.userType || 'Membre'}
                                                        <span className="mx-2"></span> 
                                                        {pub.createdAt ? new Date(pub.createdAt).toLocaleDateString('fr-FR', {
                                                            day: '2-digit',
                                                            month: '2-digit',
                                                            year: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        }) : 'Date inconnue'}
                                                    </p>
                                                </div>
                                            </div>
                                            <button className="p-2 rounded-full hover:bg-white-50 dark:hover:bg-white-300 transition-colors">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white-200 dark:text-white-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <p className="font-geist-mono text-white-300 dark:text-white-100 mb-4">
                                            {pub.content}
                                        </p>

                                        {pub.media && (
                                            <div className="mb-4 rounded-lg overflow-hidden">
                                                <img 
                                                    src={pub.media} 
                                                    alt="Média de la publication" 
                                                    className="w-full h-auto max-h-96 object-contain"
                                                />
                                            </div>
                                        )}
                                        {pub.budget && (
                                            <div className="mb-4 p-3 bg-white-50 dark:bg-white-300 rounded-lg border border-purple-500">
                                                <div className="flex items-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                <span className="font-geist-mono font-bold text-purple-500">
                                                            Budget: {pub.budget} Dt
                                                </span>
                                                </div>
                                            </div>
                                        )}
                                        
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {pub.tags?.map((tag, index) => (
                                                <span 
                                                    key={`tag-${pub._id}-${index}`} 
                                                    className="text-xs font-geist-mono px-3 py-1 bg-white-50 dark:bg-white-300 text-white-200 rounded-full"
                                                >
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>

                                        {!isCurrentUser && (
                                            <div className="flex justify-end mt-4">
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleContact(pub);
                                                    }}
                                                    className="font-geist-mono px-4 py-2 bg-green-500 hover:bg-green-600 text-white-50 rounded-lg transition-colors"
                                                >
                                                    Contacter
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-10 text-center">
                        <button className="font-geist-mono px-6 py-3 bg-white-100 dark:bg-white-200 text-white-300 dark:text-white-50 rounded-lg hover:bg-white-200 dark:hover:bg-white-300 transition-colors">
                            Charger plus de publications
                        </button>
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
                    <div className="bg-white-50 dark:bg-white-300 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6 pb-4 border-b border-white-200 dark:border-white-100">
                                <h2 className="text-2xl font-dosis font-bold text-white-300 dark:text-white-50">
                                    Créer une nouvelle publication
                                </h2>
                                <button 
                                    onClick={closeModal}
                                    className="p-2 rounded-full hover:bg-white-100 dark:hover:bg-white-200 transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white-200 dark:text-white-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            
                            <form onSubmit={submitPublication} className="space-y-6">
                                <div>
                                    <label className="block font-dosis font-bold text-white-300 dark:text-white-50 mb-2">
                                        Contenu
                                    </label>
                                    <textarea
                                        name="content"
                                        value={newPublication.content}
                                        onChange={handleChange}
                                        placeholder="Quoi de neuf ? Partagez vos réalisations, conseils ou questions..."
                                        className="w-full bg-white-100 dark:bg-white-200 rounded-lg p-4 font-geist-mono text-white-300 dark:text-white-100 placeholder-white-200 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[150px]"
                                        required
                                    ></textarea>
                                </div>

                                <div>
                                    <label className="block font-dosis font-bold text-white-300 dark:text-white-50 mb-2">
                                        Budget (optionnel)
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                            <span className="font-geist-mono text-white-200 dark:text-white-100">Dt</span>
                                        </div>
                                        <input
                                            type="text"
                                            name="budget"
                                            value={newPublication.budget}
                                            onChange={handleChange}
                                            placeholder="Montant estimé"
                                            className="w-full bg-white-100 dark:bg-white-200 rounded-lg pl-10 p-3 font-geist-mono text-white-300 dark:text-white-100 placeholder-white-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block font-dosis font-bold text-white-300 dark:text-white-50 mb-2">
                                        Ajouter une image/vidéo (optionnel)
                                    </label>
                                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-white-200 dark:border-white-100 rounded-lg p-8 text-center cursor-pointer hover:bg-white-100 dark:hover:bg-white-200 transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white-200 dark:text-white-100 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <p className="font-geist-mono text-white-200 dark:text-white-100">
                                            Cliquez pour télécharger ou glissez-déposez
                                        </p>
                                        <p className="text-sm font-geist-mono text-white-200 dark:text-white-100 mt-1">
                                            PNG, JPG, GIF ou MP4 (max 10MB)
                                        </p>
                                        <input 
                                            type="file" 
                                            className="hidden" 
                                            accept="image/*,video/*" 
                                            onChange={handleMediaChange}
                                        />
                                    </div>
                                    
                                    {newPublication.media && (
                                        <div className="mt-4 relative">
                                            <div className="bg-gray-200 rounded-lg overflow-hidden w-full h-48">
                                                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-full" />
                                            </div>
                                            <button 
                                                type="button"
                                                onClick={() => setNewPublication({...newPublication, media: null})}
                                                className="absolute top-2 right-2 bg-white-300 dark:bg-white-100 rounded-full p-1"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block font-dosis font-bold text-white-300 dark:text-white-50 mb-2">
                                        Tags (max 5)
                                    </label>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {newPublication.tags.map((tag, index) => (
                                            <span 
                                                key={index} 
                                                className="flex items-center text-xs font-geist-mono px-3 py-1 bg-white-100 dark:bg-white-200 text-white-300 dark:text-white-50 rounded-full"
                                            >
                                                #{tag}
                                                <button 
                                                    type="button"
                                                    onClick={() => removeTag(index)}
                                                    className="ml-2 text-white-200 hover:text-white-300"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                    
                                    <div className="flex space-x-2">
                                        <input
                                            type="text"
                                            name="tagInput"
                                            value={newPublication.tagInput}
                                            onChange={handleChange}
                                            placeholder="Ajouter un tag"
                                            className="flex-grow bg-white-100 dark:bg-white-200 rounded-lg p-3 font-geist-mono text-white-300 dark:text-white-100 placeholder-white-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        />
                                        <button 
                                            type="button"
                                            onClick={addTag}
                                            className="px-4 py-2 bg-white-200 dark:bg-white-100 text-white-50 rounded-lg hover:bg-white-300 dark:hover:bg-white-200 transition-colors"
                                        >
                                            Ajouter
                                        </button>
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-3 pt-4">
                                    <button 
                                        type="button"
                                        onClick={closeModal}
                                        className="font-geist-mono px-6 py-2 bg-white-100 dark:bg-white-200 text-white-300 dark:text-white-50 rounded-lg hover:bg-white-200 dark:hover:bg-white-300 transition-colors"
                                    >
                                        Annuler
                                    </button>
                                    <button 
                                        type="submit"
                                        className="font-geist-mono px-6 py-2 bg-purple-500 text-white-50 rounded-lg hover:bg-purple-600 transition-colors"
                                    >
                                        Publier
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {showSubscriptionModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
                    <div className="bg-white-50 dark:bg-white-300 rounded-2xl shadow-2xl w-full max-w-md">
                        <div className="p-8">
                            <div className="text-center mb-6">
                                <div className="mx-auto bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full p-3 w-16 h-16 flex items-center justify-center mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-dosis font-bold text-white-300 dark:text-white-50 mb-2">
                                    Abonnement Requis
                                </h3>
                                <p className="font-geist-mono text-white-200 dark:text-white-100">
                                    Pour publier en tant que freelancer, vous devez souscrire à un abonnement premium.
                                </p>
                            </div>

                            <div className="bg-white-100 dark:bg-white-200 rounded-xl p-5 mb-6">
                                <ul className="space-y-3">
                                    <li className="flex items-start">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span className="font-geist-mono text-white-300 dark:text-white-100">
                                            Publiez vos projets et services illimités
                                        </span>
                                    </li>
                                    <li className="flex items-start">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span className="font-geist-mono text-white-300 dark:text-white-100">
                                            Augmentez votre visibilité auprès des clients
                                        </span>
                                    </li>
                                    <li className="flex items-start">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span className="font-geist-mono text-white-300 dark:text-white-100">
                                            Accès aux projets premium
                                        </span>
                                    </li>
                                </ul>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={closeSubscriptionModal}
                                    className="font-geist-mono px-4 py-3 bg-white-100 dark:bg-white-200 text-white-300 dark:text-white-50 rounded-lg hover:bg-white-200 dark:hover:bg-white-300 transition-colors"
                                >
                                    Plus tard
                                </button>
                                <button
                                    onClick={goToSubscriptionPage}
                                    className="font-geist-mono px-4 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white-50 rounded-lg hover:from-purple-600 hover:to-indigo-700 transition-all"
                                >
                                    S'abonner
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showContactSubscriptionModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
                    <div className="bg-white-50 dark:bg-white-300 rounded-2xl shadow-2xl w-full max-w-md">
                        <div className="p-8">
                            <div className="text-center mb-6">
                                <div className="mx-auto bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full p-3 w-16 h-16 flex items-center justify-center mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-dosis font-bold text-white-300 dark:text-white-50 mb-2">
                                    Abonnement Requis
                                </h3>
                                <p className="font-geist-mono text-white-200 dark:text-white-100">
                                    Pour contacter les professionnels, vous devez souscrire à un abonnement premium.
                                </p>
                            </div>

                            <div className="bg-white-100 dark:bg-white-200 rounded-xl p-5 mb-6">
                                <ul className="space-y-3">
                                    <li className="flex items-start">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span className="font-geist-mono text-white-300 dark:text-white-100">
                                            Contactez les professionnels sans limite
                                        </span>
                                    </li>
                                    <li className="flex items-start">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span className="font-geist-mono text-white-300 dark:text-white-100">
                                            Accédez aux coordonnées complètes
                                        </span>
                                    </li>
                                    <li className="flex items-start">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span className="font-geist-mono text-white-300 dark:text-white-100">
                                            Envoyez des messages directs
                                        </span>
                                    </li>
                                </ul>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={closeContactSubscriptionModal}
                                    className="font-geist-mono px-4 py-3 bg-white-100 dark:bg-white-200 text-white-300 dark:text-white-50 rounded-lg hover:bg-white-200 dark:hover:bg-white-300 transition-colors"
                                >
                                    Plus tard
                                </button>
                                <button
                                    onClick={goToSubscriptionPage}
                                    className="font-geist-mono px-4 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white-50 rounded-lg hover:from-purple-600 hover:to-indigo-700 transition-all"
                                >
                                    S'abonner
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showContactModal && selectedPublication && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
                    <div className="bg-white-50 dark:bg-white-300 rounded-2xl shadow-2xl w-full max-w-md">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-dosis font-bold text-white-300 dark:text-white-50">
                                    Contacter {selectedPublication.userId?.fullName || 'le professionnel'}
                                </h2>
                                <button 
                                    onClick={closeContactModal}
                                    className="p-2 rounded-full hover:bg-white-100 dark:hover:bg-white-200 transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white-200 dark:text-white-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            
                            {messageSent ? (
                                <div className="text-center py-8">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-dosis font-bold text-green-500 mb-2">
                                        Message envoyé!
                                    </h3>
                                    <p className="font-geist-mono text-white-200 dark:text-white-100">
                                        Votre message a été envoyé avec succès.
                                    </p>
                                </div>
                            ) : (
                                <form onSubmit={sendContactMessage}>
                                    <div className="mb-4">
                                        <label className="block font-dosis font-bold text-white-300 dark:text-white-50 mb-2">
                                            Votre message
                                        </label>
                                        <textarea
                                            value={contactMessage}
                                            onChange={(e) => setContactMessage(e.target.value)}
                                            placeholder={`Bonjour ${selectedPublication.userId?.fullName || ''}, je suis intéressé par votre publication...`}
                                            className="w-full bg-white-100 dark:bg-white-200 rounded-lg p-4 font-geist-mono text-white-300 dark:text-white-100 placeholder-white-200 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[150px]"
                                            required
                                        ></textarea>
                                    </div>
                                    
                                    <div className="flex justify-end space-x-3">
                                        <button 
                                            type="button"
                                            onClick={closeContactModal}
                                            className="font-geist-mono px-6 py-2 bg-white-100 dark:bg-white-200 text-white-300 dark:text-white-50 rounded-lg hover:bg-white-200 dark:hover:bg-white-300 transition-colors"
                                        >
                                            Annuler
                                        </button>
                                        <button 
                                            type="submit"
                                            disabled={isSendingMessage}
                                            className="font-geist-mono px-6 py-2 bg-purple-500 text-white-50 rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-75"
                                        >
                                            {isSendingMessage ? (
                                                <span className="flex items-center">
                                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Envoi en cours...
                                                </span>
                                            ) : "Envoyer"}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PublicationsPage;