import dbConnect from '@/lib/dbConnect';
import Message from '@/models/Message';
import Conversation from '@/models/Conversation';

export const POST = async (request) => {
  await dbConnect();
  
  try {
    const { conversationId, userId } = await request.json();
    
    if (!conversationId || !userId) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Marquer les messages comme lus
    await Message.updateMany(
      { 
        conversation: conversationId,
        sender: { $ne: userId },
        readBy: { $ne: userId }
      },
      { $push: { readBy: userId } }
    );

    // Réinitialiser le compteur de messages non lus
    await Conversation.findByIdAndUpdate(conversationId, {
      $set: { [`unreadCount.${userId}`]: 0 }
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error("Error marking messages as read:", error);
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};