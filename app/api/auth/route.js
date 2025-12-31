import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import dbConnect from "@/lib/db";
import User from "../../models/User";

export async function GET() {
  try {
    const token = cookies().get("auth")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );

    await dbConnect();

    const user = await User.findById(payload.id).select("-password");
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
    return NextResponse.json(
      { success: false, message: "Session expired" },
      { status: 401 }
    );
  }
}


export async function PUT(req) {
  try {
    const token = cookies().get("auth")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );

    const {
      username,
      street,
      city,
      pincode,
      mobile,
      gender,
    } = await req.json();

    await dbConnect();

    const updatedUser = await User.findByIdAndUpdate(
      payload.id,
      {
        username,
        mobile,
        gender,
        address: { street, city, pincode },
      },
      { new: true }
    ).select("-password");

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
  } catch {
    return NextResponse.json(
      { success: false, message: "Session expired" },
      { status: 401 }
    );
  }
}
