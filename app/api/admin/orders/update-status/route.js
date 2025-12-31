import dbConnect from "../../../../../lib/db";
import Order from "@/app/models/Order";
import { NextResponse } from "next/server";

export async function PATCH(req) {
  try {
    await dbConnect();

    const { orderId, status } = await req.json();

    await Order.findByIdAndUpdate(orderId, {
      status,
      updatedAt: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Status update error:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}