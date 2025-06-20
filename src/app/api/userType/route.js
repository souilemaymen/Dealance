import { NextResponse } from "next/server";
import dbConnect from '@/app/api/lib/dbConnect';
import User from "@/app/api/models/User";

export async function POST (req){
    try {
        const body = await req.json();
        const {userType} = body;
        if (!userType){
            return NextResponse.json({error:" userType is required"},{status : 400});
        }  
        await dbConnect();
        const newuser = await User.create({ userType });
        await newuser.save();
        return NextResponse.json({message:"User created successfully"},{status : 201});
    } catch (err) {
        return Next.NextResponse.json({error :"server error"},{status : 500});
    }
}








