import { NextResponse } from 'next/server';
import { initSocket } from '../lib/socketManager';

export async function GET(req) {
  const { nextUrl } = req;
  
  if (nextUrl.searchParams.get('init')) {
    if (!req.socket.server.io) {
      console.log('Initialisation de Socket.IO');
      const server = req.socket.server;
      const io = initSocket(server);
      req.socket.server.io = io;
    }
    
    return NextResponse.json({ status: 'Socket.IO initialisé' });
  }

  return NextResponse.json({ error: 'Requête invalide' }, { status: 400 });
}