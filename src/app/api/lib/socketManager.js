import { Server } from 'socket.io';

let io = null;

export const initSocket = (server) => {
  io = new Server(server, {
    path: '/api/socket',
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log('Nouvelle connexion socket:', socket.id);

    socket.on('join-conversations', (conversationIds) => {
      conversationIds.forEach(id => {
        socket.join(`conv_${id}`);
      });
    });

    socket.on('join-conversation', (conversationId) => {
      socket.join(`conv_${conversationId}`);
    });

    socket.on('disconnect', () => {
      console.log('Déconnexion socket:', socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error("Socket.IO non initialisé");
  return io;
};