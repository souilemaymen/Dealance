import { NextResponse } from "next/server";
import dbConnect from "@/app/api/lib/dbConnect";
import User from "@/app/api/models/User";

export async function PATCH(req, context) {
  const {
    params: { id },
  } = context;

  await dbConnect();

  const updatedData = await req.json();

  try {
    const updatedUser = await User.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
