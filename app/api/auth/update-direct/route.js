// app/api/auth/update-direct/route.js
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db";
import User from "@/app/models/User";

export async function PUT(req) {
  try {
    console.log("🎯 Direct update endpoint called");
    
    // Get token
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const body = await req.json();
    console.log("🎯 Request body:", body);
    
    await dbConnect();
    
    // Find user first
    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }
    
    console.log("🎯 User before update:", {
      username: user.username,
      mobile: user.mobile,
      gender: user.gender,
      address: user.address
    });
    
    // Update fields manually
    if (body.username) user.username = body.username;
    if (body.mobile) user.mobile = body.mobile;
    if (body.gender) user.gender = body.gender;
    
    // Update address
    if (body.street || body.city || body.pincode) {
      user.address = {
        street: body.street || user.address?.street || '',
        city: body.city || user.address?.city || '',
        pincode: body.pincode || user.address?.pincode || '',
      };
    }
    
    // Save the user
    await user.save();
    console.log("🎯 User saved successfully");
    
    // Fetch again to verify
    const updatedUser = await User.findById(decoded.id).select("-password");
    console.log("🎯 User after update:", {
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
      }
    });
    
  } catch (error) {
    console.error("❌ Direct update error:", error);
    return NextResponse.json(
      { success: false, message: "Server error: " + error.message },
      { status: 500 }
    );
  }
}