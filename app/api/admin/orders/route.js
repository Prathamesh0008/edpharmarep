import dbConnect from "../../../../lib/db";
import Order from "@/app/models/Order";
import User from "@/app/models/User";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "");

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth")?.value;

    if (!token || !process.env.JWT_SECRET) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, secret);
    if (payload?.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await dbConnect();

    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .lean();

    const userIds = [...new Set(orders.map((o) => String(o.userId || "")).filter(Boolean))];
    const users = await User.find({ _id: { $in: userIds } })
      .select("_id username email mobile address role")
      .lean();

    const userMap = new Map(users.map((u) => [String(u._id), u]));

    const normalizedOrders = orders.map((order) => {
      const linkedUser = userMap.get(String(order.userId || ""));
      const customerName =
        order?.address?.fullName || linkedUser?.username || "Guest";
      const customerEmail =
        order?.address?.email || order?.userEmail || linkedUser?.email || "";
      const customerPhone =
        order?.address?.phone || linkedUser?.mobile || "";
      const city =
        order?.address?.city || linkedUser?.address?.city || "";
      const fullAddress = order?.address
        ? `${order.address.address || ""}, ${order.address.city || ""}, ${
            order.address.pincode || ""
          }, ${order.address.country || ""}`.replace(/\s+,/g, ",").replace(/^,\s*/, "")
        : "";

      return {
        ...order,
        customer: {
          userId: order?.userId || null,
          name: customerName,
          email: customerEmail,
          phone: customerPhone,
          city,
          fullAddress,
          role: linkedUser?.role || "user",
        },
      };
    });

    return NextResponse.json(normalizedOrders);
  } catch (error) {
    console.error("ADMIN ORDERS ERROR:", error);

    return NextResponse.json([], { status: 500 });
  }
}
