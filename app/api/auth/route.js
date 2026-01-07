import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db";
import User from "@/app/models/User";

// GET - Get user profile
export async function GET(req) {
  try {
    console.log("🔐 GET Profile endpoint called");
    
    // Get token from Authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log("🔐 No valid authorization header");
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("🔐 Token decoded for user:", decoded.email);
    
    await dbConnect();
    
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        mobile: user.mobile || "",
        gender: user.gender || "",
        street: user.address?.street || "",
        city: user.address?.city || "",
        pincode: user.address?.pincode || "",
      },
    });
    
  } catch (err) {
    console.error("🔐 GET Profile error:", err.message);
    
    if (err.name === 'JsonWebTokenError') {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

// PUT - Update user profile
// In /app/api/auth/route.js - Only update the PUT function
export async function PUT(req) {
  try {
    console.log("🔐 PUT: Profile update called");
    
    // Get token from Authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log("🔐 PUT: No valid authorization header");
      // Also try cookies as fallback (for backward compatibility)
      try {
        const cookieStore = await cookies();
        const cookieToken = cookieStore.get("auth")?.value;
        if (!cookieToken) {
          return NextResponse.json(
            { success: false, message: "Unauthorized" },
            { status: 401 }
          );
        }
        // Use cookie token
        var token = cookieToken;
      } catch (cookieError) {
        return NextResponse.json(
          { success: false, message: "Unauthorized" },
          { status: 401 }
        );
      }
    } else {
      var token = authHeader.substring(7);
    }
    
    console.log("🔐 PUT: Token received");
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("🔐 PUT: Token decoded, user ID:", decoded.id);
    
    const body = await req.json();
    console.log("🔐 PUT: Request body:", body);
    
    await dbConnect();
    
    // Find user first
    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }
    
    console.log("🔐 PUT: Current user:", {
      username: user.username,
      mobile: user.mobile,
      gender: user.gender,
      address: user.address
    });
    
    // Update fields - Direct assignment (simpler)
    if (body.username !== undefined) {
      user.username = body.username;
    }
    if (body.mobile !== undefined) {
      user.mobile = body.mobile;
    }
    if (body.gender !== undefined) {
      user.gender = body.gender;
    }
    
    // Update address
    if (body.street !== undefined || body.city !== undefined || body.pincode !== undefined) {
      user.address = {
        street: body.street !== undefined ? body.street : (user.address?.street || ""),
        city: body.city !== undefined ? body.city : (user.address?.city || ""),
        pincode: body.pincode !== undefined ? body.pincode : (user.address?.pincode || ""),
      };
    }
    
    console.log("🔐 PUT: Saving user...");
    await user.save();
    
    // Fetch fresh data to confirm
    const updatedUser = await User.findById(decoded.id).select("-password");
    
    console.log("🔐 PUT: User after save:", {
      username: updatedUser.username,
      mobile: updatedUser.mobile,
      gender: updatedUser.gender,
      address: updatedUser.address
    });
    
    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        username: updatedUser.username,
        email: updatedUser.email,
        mobile: updatedUser.mobile || "",
        gender: updatedUser.gender || "",
        street: updatedUser.address?.street || "",
        city: updatedUser.address?.city || "",
        pincode: updatedUser.address?.pincode || "",
      },
    });
    
  } catch (err) {
    console.error("❌ PUT: Update error:", err);
    
    if (err.name === 'JsonWebTokenError') {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }
    
    if (err.name === 'ValidationError') {
      return NextResponse.json(
        { success: false, message: "Validation error" },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}