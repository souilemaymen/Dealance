import { NextResponse } from 'next/server';
import Message from '../models/Message';
import Conversation from '../models/Conversation';
import { getIO } from '../lib/socketManager';
import { connectDB } from '../lib/dbConnect';

export async function GET(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const conversationId = searchParams.get('conversationId');
  const page = parseInt(searchParams.get('page') || 1);
  const limit = 20;
  const skip = (page - 1) * limit;

  try {
    const messages = await Message.find({ conversation: conversationId })
      .populate('sender', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return NextResponse.json(messages.reverse());
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur récupération messages' }, 
      { status: 500 }
    );
  }
}

export async function POST(req) {
  await connectDB();
  const { conversationId, sender, text } = await req.json();

  try {
    const newMessage = new Message({ 
      conversation: conversationId, 
      sender, 
      text 
    });
    
    await newMessage.save();
    await newMessage.populate('sender', 'name avatar');

    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: newMessage._id,
      updatedAt: new Date()
    });

    const io = getIO();
    io.to(`conv_${conversationId}`).emit('new-message', newMessage);

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur envoi message' }, 
      { status: 500 }
    );
  }
}