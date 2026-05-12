import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db";
import User from "@/app/models/User";

export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json();
    console.log("📝 Registration data:", body);

    const {
      username,
      email,
      password,
      gender = "",
      mobile = "",
      street = "",
      city = "",
      pincode = "",
    } = body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user with ALL fields
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      gender,
      mobile,
      address: {
        street,
        city,
        pincode,
      },
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    const userResponse = {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      mobile: user.mobile,
      gender: user.gender,
      street: user.address?.street || "",
      city: user.address?.city || "",
      pincode: user.address?.pincode || "",
    };

    const response = NextResponse.json({
      success: true,
      message: "User created successfully",
      user: userResponse,
      token,
    });

    // Set cookie
    response.cookies.set("auth", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return response;

  } catch (error) {
    console.error("❌ Registration error:", error);
    return NextResponse.json(
      { success: false, message: "Server error: " + error.message },
      { status: 500 }
    );
  }
}
