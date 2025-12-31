import dbConnect from "@/lib/db";
import User from "../../../models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();

    const {
      username,
      email,
      password,
      street = "",
      city = "",
      pincode = "",
      gender = "",
      mobile = "",
    } = body;

    // 🔒 Basic validation
    if (!username || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Username, email and password are required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase();

    const exists = await User.findOne({ email: normalizedEmail });
    if (exists) {
      return NextResponse.json(
        { success: false, message: "User already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ ADDRESS AS STRING (MATCHING YOUR SCHEMA)
    const combinedAddress =
      street || city || pincode
        ? `${street}, ${city} - ${pincode}`
        : "";

    const user = await User.create({
      username,
      email: normalizedEmail,
      password: hashedPassword,
      address: combinedAddress,
      street,
      city,
      pincode,
      mobile,
      gender,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully",
        user: {
          username: user.username,
          email: user.email,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("REGISTER ERROR:", err);

    return NextResponse.json(
      { success: false, message: "Server error while registering user" },
      { status: 500 }
    );
  }
}