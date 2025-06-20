import { NextResponse } from 'next/server';
import Conversation from '../models/Conversation';
import User from '../models/User';
import { connectDB } from '../lib/dbConnect';

export async function GET(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  try {
    const conversations = await Conversation.find({
      participants: userId
    })
    .populate({
      path: 'participants',
      select: 'name avatar'
    })
    .populate({
      path: 'lastMessage',
      select: 'text createdAt'
    })
    .sort({ updatedAt: -1 });

    return NextResponse.json(conversations);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur serveur' }, 
      { status: 500 }
    );
  }
}

export async function POST(req) {
  await connectDB();
  const { participants } = await req.json();

  try {
    const existingConv = await Conversation.findOne({
      participants: { $all: participants, $size: participants.length }
    })
    .populate('participants', 'name avatar');

    if (existingConv) {
      return NextResponse.json(existingConv);
    }

    const newConversation = new Conversation({ participants });
    await newConversation.save();
    await newConversation.populate('participants', 'name avatar');

    return NextResponse.json(newConversation, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur création conversation' }, 
      { status: 500 }
    );
  }
}