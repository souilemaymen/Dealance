// code edited : 
// app/api/user/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/app/api/lib/dbConnect';
import User from '@/app/api/models/User';

// PATCH: Update user profile with form data
export async function PATCH(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    await dbConnect();
    const body = await req.json();

    //console.log("📦 Données reçues dans PATCH :", body);

    const updatedUser = await User.findByIdAndUpdate(userId, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
// GET: Retrieve user profile
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    await dbConnect();
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({
      fullName: user.fullName,
      userType: user.userType,
      profileImage: user.profileImage,
      bio: user.bio,
      category: user.category,
      experience: user.experience,
      github: user.github,
      linkedin: user.linkedin,
      portfolio: user.portfolio,
      technologies: user.technologies,
    });
  } catch (error) {
    console.error('Get error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// end code edited 