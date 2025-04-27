import { connectDb } from "@/dbConfig/dbConfig";
import User from "@/models/user.models";
import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/utils/mailer";

connectDb();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, firstName, lastName } = body;
    const user = await User.findOne({ email });
    if (user) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });

    const savedUser = await newUser.save();
    console.log("savedUser", savedUser);
    await sendEmail({
      email,
      emailType: "VERIFY",
      userId: savedUser._id,
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
