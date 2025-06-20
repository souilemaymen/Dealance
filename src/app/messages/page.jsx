// src/app/messages/page.jsx
"use client";
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Search, Send, MoreVertical, ArrowLeft, Link, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import io from 'socket.io-client';
const MessagesPage = () => {
  const { data: session } = useSession();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // code use Effect 
// Vérifier l'authentification
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Initialiser Socket.IO et charger l'utilisateur
  useEffect(() => {
    if (status !== 'authenticated') return;

    // Charger l'utilisateur courant
    const fetchCurrentUser = async () => {
      try {
        const res = await fetch(`/api/users?userId=${session.user.id}`);
        if (!res.ok) throw new Error('Erreur de chargement utilisateur');
        
        const user = await res.json();
        setCurrentUser(user);
      } catch (error) {
        console.error('Erreur chargement utilisateur:', error);
      }
    };

    fetchCurrentUser();

    // Initialiser Socket.IO
    socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
      path: '/api/socket',
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // Initialiser le serveur Socket.IO
    fetch('/api/socket?init=true');

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [session, status]); // Ajout de status comme dépendance

  // end code useffect
// Données simulées pour les conversations
  const mockConversations = [
    {
      id: 1,
      name: "Alex Dupont",
      lastMessage: "Salut, comment va le projet?",
      time: "10:30",
      unread: 2,
      avatar: "/avatar1.png"
    },
    {
      id: 2,
      name: "Marie Curie",
      lastMessage: "J'ai envoyé les documents",
      time: "09:15",
      unread: 0,
      avatar: "/avatar2.png"
    },
    {
      id: 3,
      name: "Thomas Martin",
      lastMessage: "On se voit demain?",
      time: "Hier",
      unread: 5,
      avatar: "/avatar3.png"
    },
    {
      id: 4,
      name: "Sophie Bernard",
      lastMessage: "Merci pour ton aide!",
      time: "Hier",
      unread: 0,
      avatar: "/avatar4.png"
    },
    {
      id: 5,
      name: "Équipe Marketing",
      lastMessage: "Réunion reportée à 15h",
      time: "12/05",
      unread: 0,
      avatar: "/group-avatar.png"
    }
  ];

  // Données simulées pour les messages
  const mockMessages = {
    1: [
      { id: 1, text: "Salut Alex!", sender: "me", time: "10:25" },
      { id: 2, text: "Salut, comment va le projet?", sender: "them", time: "10:30" },
      { id: 3, text: "Ça avance bien, je te montre ça demain?", sender: "me", time: "10:32" },
      { id: 4, text: "Parfait, à demain!", sender: "them", time: "10:35" }
    ],
    2: [
      { id: 1, text: "Bonjour Marie, j'ai besoin de ton expertise", sender: "me", time: "09:00" },
      { id: 2, text: "J'ai envoyé les documents", sender: "them", time: "09:15" },
      { id: 3, text: "Merci, je les regarde tout de suite!", sender: "me", time: "09:20" }
    ],
    3: [
      { id: 1, text: "Salut Thomas, tu es libre demain?", sender: "me", time: "18:30" },
      { id: 2, text: "On se voit demain?", sender: "them", time: "19:45" },
      { id: 3, text: "Oui, vers 14h ça te va?", sender: "me", time: "20:10" }
    ],
    4: [
      { id: 1, text: "Merci pour ton aide sur le dossier!", sender: "them", time: "16:20" },
      { id: 2, text: "Avec plaisir, content d'avoir pu aider!", sender: "me", time: "16:35" }
    ],
    5: [
      { id: 1, text: "Chers tous, la réunion de 14h est reportée à 15h", sender: "them", time: "12:05" },
      { id: 2, text: "D'accord, merci pour l'info", sender: "me", time: "12:10" }
    ]
  };

  useEffect(() => {
    // Simuler le chargement des conversations
    setConversations(mockConversations);
  }, []);

  const handleSelectConversation = (conversation) => {
    setActiveConversation(conversation);
    setMessages(mockMessages[conversation.id] || []);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    
    const newMsg = {
      id: messages.length + 1,
      text: newMessage,
      sender: "me",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage('');
    
    // Simuler une réponse
    setTimeout(() => {
      const reply = {
        id: messages.length + 2,
        text: "Merci pour votre message, je vous réponds bientôt!",
        sender: "them",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, reply]);
    }, 2000);
  };

  const filteredConversations = conversations.filter(conv => 
    conv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const router = useRouter();
  return (
    <div className="flex flex-col h-screen bg-white-50 dark:bg-white-300 text-white-300 dark:text-white-100">
      {/* En-tête */}
            <header className="bg-white-200 dark:bg-white-200 py-4 px-6 flex items-center justify-between border-b border-white-100">
        <div className="flex items-center">
          {activeConversation ? (
            <>
              <button 
                onClick={() => setActiveConversation(null)}
                className="mr-4 md:hidden"
              >
                <ArrowLeft size={24} />
              </button>
              <div className="flex items-center">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-12 h-12" />
                <div className="ml-3">
                  <h2 className="font-dosis text-xl font-bold">{activeConversation.name}</h2>
                  <p className="font-geist-mono text-sm text-white-50 dark:text-white-50">En ligne</p>
                </div>
              </div>
            </>
          ) : (
            <h1 className="font-dosis text-2xl font-bold">Messages</h1>
          )}
        </div>
        <button 
    onClick={() => router.push('/Acceuil')}
    className="p-2 rounded-full hover:bg-white-100 dark:hover:bg-white-300 transition"
    aria-label="Retour à l'accueil"
  >
    <Home size={24} />
  </button>
        
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Liste des conversations - visible sur desktop, cachée sur mobile quand une conversation est active */}
        <div className={`w-full md:w-80 bg-white-100 dark:bg-white-200 border-r border-white-50 dark:border-white-300 flex flex-col ${activeConversation ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b border-white-50 dark:border-white-300">
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                <Search size={20} />
              </div>
              <input
                type="text"
                placeholder="Rechercher une conversation..."
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-white-50 dark:bg-white-100 focus:outline-none focus:ring-1 focus:ring-white-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-y-auto flex-1">
            {filteredConversations.map((conversation) => (
              <motion.div
                key={conversation.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ backgroundColor: 'rgba(92, 77, 124, 0.1)' }}
                className={`flex items-center p-4 cursor-pointer border-b border-white-50 dark:border-white-300 ${
                  activeConversation?.id === conversation.id ? 'bg-white-200/50 dark:bg-white-300/50' : ''
                }`}
                onClick={() => handleSelectConversation(conversation)}
              >
                <div className="relative">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-12 h-12" />
                  {conversation.unread > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white-50 rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      {conversation.unread}
                    </span>
                  )}
                </div>
                <div className="ml-4 flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className="font-dosis font-bold truncate">{conversation.name}</h3>
                    <span className="font-geist-mono text-xs text-white-300 dark:text-white-50">{conversation.time}</span>
                  </div>
                  <p className="font-geist-mono text-sm truncate text-white-300 dark:text-white-100">
                    {conversation.lastMessage}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Zone de conversation - visible quand une conversation est sélectionnée */}
        {activeConversation && (
          <div className="flex-1 flex flex-col md:flex">
            {/* En-tête de conversation (mobile) */}
            <div className="md:hidden p-4 border-b border-white-50 dark:border-white-300 flex items-center">
              <button 
                onClick={() => setActiveConversation(null)}
                className="mr-4"
              >
                <ArrowLeft size={24} />
              </button>
              <div className="flex items-center">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
                <div className="ml-3">
                  <h2 className="font-dosis font-bold">{activeConversation.name}</h2>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-white-50 dark:bg-white-100">
              <div className="max-w-3xl mx-auto">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex mb-6 ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl ${
                        message.sender === 'me'
                          ? 'bg-white-200 text-white-50 rounded-tr-none'
                          : 'bg-white-100 dark:bg-white-200 text-white-300 dark:text-white-50 rounded-tl-none'
                      }`}
                    >
                      <p className="font-geist-mono">{message.text}</p>
                      <p className="text-xs opacity-70 mt-1 text-right">
                        {message.time}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Champ d'envoi de message */}
            <div className="p-4 border-t border-white-100 dark:border-white-300 bg-white-100 dark:bg-white-200">
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Écrivez un message..."
                  className="flex-1 px-4 py-3 rounded-full bg-white-50 dark:bg-white-100 focus:outline-none focus:ring-1 focus:ring-white-200"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button
                  onClick={handleSendMessage}
                  className="ml-4 bg-white-200 text-white-50 w-12 h-12 rounded-full flex items-center justify-center hover:bg-opacity-90 transition"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Aucune conversation sélectionnée (vue desktop) */}
        {!activeConversation && (
          <div className="hidden md:flex flex-1 items-center justify-center bg-white-50 dark:bg-white-100">
            <div className="text-center">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto" />
              <h2 className="font-dosis text-xl font-bold mt-4">Sélectionnez une conversation</h2>
              <p className="font-geist-mono mt-2 max-w-md">
                Commencez une nouvelle conversation ou sélectionnez une conversation existante dans votre liste
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;