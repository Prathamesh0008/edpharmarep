import dbConnect from "../../../../lib/db";
import Order from "@/app/models/Order";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();

    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .lean();

    console.log("Fetched orders from DB:", orders);

    // ✅ RETURN ARRAY DIRECTLY
    return NextResponse.json(orders);
  } catch (error) {
    console.error("ADMIN ORDERS ERROR:", error);

    // ✅ ALWAYS ARRAY
    return NextResponse.json([], { status: 500 });
  }
}
