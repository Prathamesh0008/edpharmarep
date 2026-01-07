import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db";
import User from "@/app/models/User";

export async function POST(req) {
  try {
    await dbConnect();

    const { email, password } = await req.json();

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 400 }
      );
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 400 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    const userResponse = {
      _id: user._id,
      username: user.username,
      email: user.email,
      mobile: user.mobile,
      gender: user.gender,
      street: user.address?.street || "",
      city: user.address?.city || "",
      pincode: user.address?.pincode || "",
    };

    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      user: userResponse,
      token, // Send token in response
    });

    // Set cookie
    response.cookies.set("auth", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60,
    });

    return response;

  } catch (error) {
    console.error("❌ Login error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}