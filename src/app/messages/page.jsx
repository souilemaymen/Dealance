"use client";
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Search, Send, ArrowLeft, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import io from 'socket.io-client';

const MessagesPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const socketRef = useRef(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Vérifier l'authentification
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Charger l'utilisateur et les conversations
  useEffect(() => {
    if (status !== 'authenticated') return;

    const fetchData = async () => {
      try {
        // Charger l'utilisateur courant
        const userRes = await fetch(`/api/users?userId=${session.user.userId}`);
        if (!userRes.ok) throw new Error('Erreur de chargement utilisateur');
        const user = await userRes.json();
        setCurrentUser(user);

        // Charger les conversations
        const convRes = await fetch(`/api/conversations?userId=${session.user.userId}`);
        if (!convRes.ok) throw new Error('Erreur de chargement des conversations');
        const convData = await convRes.json();
        setConversations(convData);
      } catch (error) {
        console.error('Erreur:', error);
      }
    };

    fetchData();
  }, [session, status]);

  // Initialiser Socket.IO
  useEffect(() => {
    if (!currentUser) return;

    socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
      path: '/api/socket',
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // Initialiser le serveur Socket.IO
    fetch('/api/socket');

    // Rejoindre les conversations
    const conversationIds = conversations.map(c => c._id);
    socketRef.current.emit('joinConversations', conversationIds);

    // Écouter les nouveaux messages
    socketRef.current.on('newMessage', (message) => {
      if (message.conversation === activeConversation?._id) {
        setMessages(prev => [...prev, message]);
      }
      
      // Mettre à jour la dernière conversation
      setConversations(prev => prev.map(conv => 
        conv._id === message.conversation ? {
          ...conv,
          lastMessage: message.text,
          lastMessageAt: message.createdAt,
          unreadCount: {
            ...conv.unreadCount,
            [currentUser._id]: conv.unreadCount[currentUser._id] || 0,
            [message.sender._id]: (conv.unreadCount[message.sender._id] || 0) + 1
          }
        } : conv
      ));
    });

    // Marquer les messages comme lus
    socketRef.current.on('messagesRead', ({ conversationId, userId }) => {
      if (conversationId === activeConversation?._id) {
        setMessages(prev => prev.map(msg => 
          msg.sender._id !== userId && !msg.readBy.includes(userId) 
            ? { ...msg, readBy: [...msg.readBy, userId] } 
            : msg
        ));
      }
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [currentUser, conversations, activeConversation]);

  // Charger les messages d'une conversation
  const handleSelectConversation = async (conversation) => {
    setActiveConversation(conversation);
    
    try {
      const res = await fetch(`/api/messages?conversationId=${conversation._id}`);
      if (!res.ok) throw new Error('Erreur de chargement des messages');
      const messagesData = await res.json();
      setMessages(messagesData);
      
      // Marquer les messages comme lus
      if (currentUser) {
        await fetch('/api/messages/read', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            conversationId: conversation._id,
            userId: currentUser._id
          })
        });
        
        // Émettre l'événement Socket.IO
        if (socketRef.current) {
          socketRef.current.emit('markAsRead', {
            conversationId: conversation._id,
            userId: currentUser._id
          });
        }
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  // Envoyer un message
  const handleSendMessage = async () => {
    if (newMessage.trim() === '' || !activeConversation || !currentUser) return;
    
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: activeConversation._id,
          senderId: currentUser._id,
          text: newMessage
        })
      });
      
      if (!response.ok) throw new Error('Erreur lors de l\'envoi du message');
      
      const sentMessage = await response.json();
      setNewMessage('');
      
      // Émettre l'événement Socket.IO
      if (socketRef.current) {
        socketRef.current.emit('sendMessage', sentMessage);
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  // Filtrer les conversations
const filteredConversations = conversations.filter(conv => {
  // Vérifier si participants existe et est un tableau
  if (!conv.participants || !Array.isArray(conv.participants)) {
    return false; // Exclure les conversations invalides
  }

  const participant = conv.participants.find(p => p._id !== currentUser?._id);
  const participantName = participant?.fullName || '';
  const lastMessage = conv.lastMessage || '';

  return (
    participantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );
});
  
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