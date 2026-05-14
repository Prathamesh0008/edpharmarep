import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db";
import User from "@/app/models/User";

export async function POST(req) {
  try {
    await dbConnect();

    const { email, password } = await req.json();

    const normalizedEmail = String(email || "").trim().toLowerCase();
    const adminEmail = String(process.env.ADMIN_EMAIL || "").trim().toLowerCase();
    const adminPassword = String(process.env.ADMIN_PASSWORD || "");

    // Admin login via server env credentials (no client-side bypass)
    if (normalizedEmail && normalizedEmail === adminEmail && password === adminPassword) {
      let adminUser = await User.findOne({ email: normalizedEmail });

      if (!adminUser) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminPassword, salt);
        adminUser = await User.create({
          username: "Admin",
          email: normalizedEmail,
          password: hashedPassword,
          role: "admin",
        });
      } else if (adminUser.role !== "admin") {
        adminUser.role = "admin";
        await adminUser.save();
      }

      const adminToken = jwt.sign(
        { id: adminUser._id, email: adminUser.email, role: "admin" },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
      );

      const adminResponse = {
        _id: adminUser._id,
        username: adminUser.username,
        email: adminUser.email,
        role: "admin",
        mobile: adminUser.mobile || "",
        gender: adminUser.gender || "",
        street: adminUser.address?.street || "",
        city: adminUser.address?.city || "",
        pincode: adminUser.address?.pincode || "",
      };

      const response = NextResponse.json({
        success: true,
        message: "Login successful",
        user: adminResponse,
        token: adminToken,
      });

      response.cookies.set("auth", adminToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60,
      });

      return response;
    }

    // Check if user exists
    const user = await User.findOne({ email: normalizedEmail });
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
