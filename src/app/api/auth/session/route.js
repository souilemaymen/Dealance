import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(req) {
  try {
    const token = req.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Renvoyer explicitement userId et userType
    return NextResponse.json({
      userId: decoded.userId || decoded.id,
      userType: decoded.userType || "",
      profileImage: decoded.profileImage || "" 
    });
  } catch (error) {
    console.error("Session error:", error);
    return NextResponse.json(
      { message: "Invalid token" },
      { status: 401 }
    );
  }
}