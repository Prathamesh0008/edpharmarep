import dbConnect from "@/lib/db";
import Order from "../../../models/Order";
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

export async function GET(request) {
  try {
    console.log("🚀 GET /api/orders/[id]");

    // Extract ID from URL
    const url = new URL(request.url);
    const pathname = url.pathname;
    const match = pathname.match(/\/api\/orders\/([^\/]+)/);
    const id = match?.[1];

    console.log("📦 Order ID:", id);

    if (!id) {
      return NextResponse.json(
        { ok: false, message: "Order ID is required" },
        { status: 400 }
      );
    }

    await dbConnect();
    console.log("✅ DB connected");

    // 🍪 Extract auth token
    const cookie = request.headers.get("cookie");
    let token = null;

    if (cookie) {
      const cookies = Object.fromEntries(
        cookie.split(";").map(c => c.trim().split("="))
      );
      token = cookies.auth;
    }

    if (!token) {
      return NextResponse.json(
        { ok: false, message: "Please login" },
        { status: 401 }
      );
    }

    // 🔐 Verify JWT
    const { payload } = await jwtVerify(token, secret);
    if (!payload?.id) {
      return NextResponse.json(
        { ok: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    console.log("🔍 Fetching order for user:", payload.id);

    // ✅ FIX: query by orderId, NOT _id
    const order = await Order.findOne({
      orderId: id,
      userId: payload.id,
    }).lean();

    if (!order) {
      return NextResponse.json(
        { ok: false, message: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true, order });

  } catch (err) {
    console.error("🔥 ORDER API ERROR:", err);
    return NextResponse.json(
      { ok: false, message: "Server error" },
      { status: 500 }
    );
  }
}
