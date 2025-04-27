import { connectDb } from "@/dbConfig/dbConfig";
import User from "@/models/user.models";
import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
connectDb();

export async function POST(req: NextRequest) {
  try {
    const reqBody = await req.json();
    const { email, password } = reqBody;
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 400 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 400 }
      );
    }
    if (!user.isVerified) {
      return NextResponse.json(
        { error: "Please verify your email" },
        { status: 400 }
      );
    }
    const token = jwt.sign(
      { userId: user._id },
      process.env.NEXT_PUBLIC_JWT_SECRET!,
      {
        expiresIn: "1d",
      }
    );
    const res = NextResponse.json(
      { token, userId: user._id, message: "Login successful" },
      { status: 200 }
    );
    res.cookies.set("token", token, {
      httpOnly: true,
    });

    return res;
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
