import { connectDb } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";

connectDb();
export async function GET(req: NextRequest) {
  try {
    const res = NextResponse.json({
      message: "logged out successfully",
      success: true,
    });
    res.cookies.set("token", "", {
      httpOnly: true,
      expires: new Date(0),
    });
    return res;
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
