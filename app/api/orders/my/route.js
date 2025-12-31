import dbConnect from "@/lib/db";
import Order from "../../../models/Order";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

/**
 * Get orders for logged-in user (cookie-based auth)
 */
export async function GET() {
  try {
    await dbConnect();

    // 🔐 Read auth cookie
    const cookieStore = await cookies();
    const token = cookieStore.get("auth")?.value; 

    if (!token) {
      return NextResponse.json(
        { ok: false, message: "Please login to continue" },
        { status: 401 }
      );
    }

    // 🔐 Verify JWT
    let userId;
    try {
      const { payload } = await jwtVerify(token, secret);
      userId = payload.id;
    } catch {
      return NextResponse.json(
        { ok: false, message: "Session expired. Please login again" },
        { status: 401 }
      );
    }

    // 🔍 Fetch only this user's orders
    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      ok: true,
      orders,
    });
  } catch (err) {
    console.error("MY_ORDERS_API_ERROR:", err);
    return NextResponse.json(
      { ok: false, message: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
