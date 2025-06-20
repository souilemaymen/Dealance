import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function middleware(req) {
  const protectedRoutes = ['/dashboard', '/profile', '/api/user'];
  const isProtected = protectedRoutes.some(route => 
    req.nextUrl.pathname.startsWith(route)
  );

  if (!isProtected) return NextResponse.next();

  const token = req.cookies.get('token')?.value;
  
  if (!token) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('userId', decoded.userId);
    
    return NextResponse.next({
      request: {
        headers: requestHeaders
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Invalid token' }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}