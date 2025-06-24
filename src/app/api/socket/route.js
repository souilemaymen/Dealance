import { Server } from 'socket.io';

let io = null;

export default function handler(req, res) {
  if (res.socket.server.io) {
    console.log("Socket.IO already initialized");
    res.end();
    return;
  }

  io = new Server(res.socket.server, {
    path: "/api/socket",
    addTrailingSlash: false
  });

  res.socket.server.io = io;

  io.on("connection", (socket) => {
    console.log(`Socket ${socket.id} connected`);

    // Rejoindre les salles de conversation
    socket.on("joinConversations", (conversationIds) => {
      conversationIds.forEach(id => {
        socket.join(`conversation_${id}`);
        console.log(`Socket ${socket.id} joined conversation_${id}`);
      });
    });

    // Envoyer un message
    socket.on("sendMessage", (message) => {
      // Diffuser le message à tous les participants sauf l'expéditeur
      socket.to(`conversation_${message.conversation}`).emit("newMessage", message);
    });

    // Marquer les messages comme lus
    socket.on("markAsRead", (data) => {
      socket.to(`conversation_${data.conversationId}`).emit("messagesRead", {
        conversationId: data.conversationId,
        userId: data.userId
      });
    });

    socket.on("disconnect", () => {
      console.log(`Socket ${socket.id} disconnected`);
    });
  });

  console.log("Socket.IO initialized");
  res.end();
}