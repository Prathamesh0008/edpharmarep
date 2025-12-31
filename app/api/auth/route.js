import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "../../models/User";


/* =======================
   GET → FETCH PROFILE
   /api/auth?email=abc@gmail.com
======================= */
export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email }).select("-password");

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
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
    console.error("GET /api/auth error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    await dbConnect();

    const {
      email,
      username,
      street,
      city,
      pincode,
      mobile,
      gender,
    } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email required" },
        { status: 400 }
      );
    }

    const updatedUser = await User.findOneAndUpdate(
      { email }, // ✅ EMAIL used
      {
        username,
        mobile,
        gender,
        address: {
          street: street || "",
          city: city || "",
          pincode: pincode || "",
        },
      },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
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
    console.error("PUT /api/auth error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
