import { connectDb } from "@/dbConfig/dbConfig";
import User from "@/models/user.models";
import { NextRequest, NextResponse } from "next/server";
import router from "next/router";
connectDb();

export async function POST(req: NextRequest) {
  try {
    const reqBody = await req.json();
    const { token } = reqBody;
    console.log("token", token);
    const user = await User.findOne({ verifyToken: token });
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }
    if (user?.verifyTokenExpiry < Date.now()) {
      return NextResponse.json({ error: "Token expired" }, { status: 400 });
    }
    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;
    await user.save();
    return NextResponse.json({ userId: user._id, success: true });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
