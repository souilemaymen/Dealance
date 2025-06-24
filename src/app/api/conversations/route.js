import dbConnect from '@/lib/dbConnect';
import Conversation from '@/models/Conversation';
import User from '@/models/User';

export const GET = async (request) => {
  await dbConnect();
  
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return new Response(JSON.stringify({ error: 'User ID required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const conversations = await Conversation.find({
      participants: userId
    })
    .populate({
      path: 'participants',
      select: 'fullName profileImage'
    })
    .populate({
      path: 'lastMessage',
      select: 'text createdAt'
    })
    .sort({ updatedAt: -1 });

    return new Response(JSON.stringify(conversations), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const POST = async (request) => {
  await dbConnect();
  
  try {
    const { userId, participantId } = await request.json();
    
    if (!userId || !participantId) {
      return new Response(JSON.stringify({ error: 'User ID and Participant ID required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Vérifier si une conversation existe déjà
    const existingConversation = await Conversation.findOne({
      participants: { $all: [userId, participantId] }
    });

    if (existingConversation) {
      return new Response(JSON.stringify(existingConversation), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Créer une nouvelle conversation
    const newConversation = new Conversation({
      participants: [userId, participantId]
    });

    await newConversation.save();
    
    // Remplir les données des participants
    const populated = await Conversation.findById(newConversation._id)
      .populate({
        path: 'participants',
        select: 'fullName profileImage'
      });

    return new Response(JSON.stringify(populated), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error("Error creating conversation:", error);
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};