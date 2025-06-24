import dbConnect from '@/lib/dbConnect';
import Message from '@/models/Message';
import Conversation from '@/models/Conversation';

export const GET = async (request) => {
  await dbConnect();
  
  try {
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('conversationId');
    
    if (!conversationId) {
      return new Response(JSON.stringify({ error: 'Conversation ID required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const messages = await Message.find({ conversation: conversationId })
      .populate('sender', 'fullName profileImage')
      .sort({ createdAt: 1 });

    return new Response(JSON.stringify(messages), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error("Error fetching messages:", error);
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const POST = async (request) => {
  await dbConnect();
  
  try {
    const { conversationId, senderId, text } = await request.json();
    
    if (!conversationId || !senderId || !text) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Créer un nouveau message
    const newMessage = new Message({
      conversation: conversationId,
      sender: senderId,
      text
    });

    await newMessage.save();
    
    // Mettre à jour la conversation
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: newMessage._id,
      lastMessageAt: newMessage.createdAt,
      $inc: { 
        [`unreadCount.${senderId}`]: 0,
        // Incrémenter le compteur pour tous les autres participants
        ...Object.fromEntries(
          (await Conversation.findById(conversationId))
            .participants
            .filter(id => id.toString() !== senderId)
            .map(id => [`unreadCount.${id}`, 1])
        )
      }
    });

    // Remplir les données de l'expéditeur
    const populated = await Message.findById(newMessage._id)
      .populate('sender', 'fullName profileImage');

    return new Response(JSON.stringify(populated), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error("Error sending message:", error);
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};