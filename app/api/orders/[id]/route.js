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
    
    // Get the ID from the request URL
    const url = new URL(request.url);
    const pathname = url.pathname;
    console.log("🌐 Pathname:", pathname);
    
    // Extract ID from pathname
    const idMatch = pathname.match(/\/api\/orders\/([^\/]+)/);
    const id = idMatch ? idMatch[1] : null;
    
    console.log("📦 Extracted ID:", id);
    
    if (!id) {
      console.log("❌ No ID in URL");
      return NextResponse.json(
        { ok: false, message: "Order ID is required" },
        { status: 400 }
      );
    }
    
    await dbConnect();
    console.log("✅ Database connected");

    // 🔐 Authentication - Alternative: Get token from request headers
    const authHeader = request.headers.get("cookie");
    console.log("🍪 Raw cookies:", authHeader);
    
    let token = null;
    if (authHeader) {
      const cookies = authHeader.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        acc[key] = value;
        return acc;
      }, {});
      token = cookies.auth;
    }
    
    console.log("🔑 Token extracted:", !!token);
    
    if (!token) {
      console.log("❌ No auth token");
      return NextResponse.json(
        { ok: false, message: "Please login" },
        { status: 401 }
      );
    }

    let payload;
    try {
      const { payload: verifiedPayload } = await jwtVerify(token, secret);
      payload = verifiedPayload;
      console.log("✅ JWT verified, user ID:", payload.id);
    } catch (jwtError) {
      console.error("❌ JWT verification failed:", jwtError);
      return NextResponse.json(
        { ok: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    if (!payload?.id) {
      console.log("❌ No user ID in token payload");
      return NextResponse.json(
        { ok: false, message: "Invalid token payload" },
        { status: 401 }
      );
    }

    console.log("🔍 Querying for order:", id, "user:", payload.id);

    // Try to find the order
    const order = await Order.findOne({
      _id: id,
      userId: payload.id,
    }).lean();

    console.log("📦 Order found:", !!order);

    if (!order) {
      console.log("❌ Order not found or doesn't belong to user");
      return NextResponse.json(
        { ok: false, message: "Order not found" },
        { status: 404 }
      );
    }

    console.log("✅ Successfully retrieved order");
    return NextResponse.json({ ok: true, order });
  } catch (err) {
    console.error("🔥 ORDER_DETAILS_ERROR:", {
      message: err.message,
      stack: err.stack,
      name: err.name
    });
    
    return NextResponse.json(
      { 
        ok: false, 
        message: "Server error",
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
      },
      { status: 500 }
    );
  }
}