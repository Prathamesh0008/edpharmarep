// app/api/orders/create/route.js
import dbConnect from "@/lib/db";
import Order from "../../../models/Order";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

function makeOrderId() {
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `ORD-${Date.now()}-${rand}`;
}

/* ================= CREATE ORDER ================= */
export async function POST(req) {
  try {
    const body = await req.json();
    const { items, totals, address, paymentMethod, orderNotes } = body;
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    const cookieStore = await cookies();
    const token = cookieStore.get("auth")?.value;

    if (!token) {
      return Response.json(
        { ok: false, message: "Please login to continue" },
        { status: 401 }
      );
    }

    let userId;

    try {
      const { payload } = await jwtVerify(token, secret);
      userId = payload.id;
    } catch {
      return Response.json(
        { ok: false, message: "Session expired. Please login again" },
        { status: 401 }
      );
    }

    // ✅ validation: items
    if (!Array.isArray(items) || items.length === 0) {
      return Response.json(
        { ok: false, message: "Cart is empty" },
        { status: 400 }
      );
    }

    // ✅ validation: address
    if (
      !address?.fullName ||
      !address?.phone ||
      !address?.email ||
      !address?.address ||
      !address?.city ||
      !address?.pincode ||
      !address?.country
    ) {
      return Response.json(
        { ok: false, message: "Address incomplete. Email is required." },
        { status: 400 }
      );
    }

    // ✅ enforce min 50 qty
    const invalid = items.find((i) => Number(i.qty) < 50);
    if (invalid) {
      return Response.json(
        {
          ok: false,
          message: `Minimum order quantity is 50 per item. "${invalid.name}" has qty ${Number(
            invalid.qty
          )}.`,
        },
        { status: 400 }
      );
    }

    await dbConnect();

    // Create order with orderNotes
    const order = await Order.create({
      userId,
      userEmail: address.email,
      orderId: makeOrderId(),
      items: items.map((i) => ({
        slug: i.slug,
        name: i.name,
        qty: Number(i.qty),
        price: Number(i.price || 0),
        image: i.image || "",
      })),
      totals: {
        totalDistinct: Number(totals?.totalDistinct || items.length),
        totalQty: Number(totals?.totalQty || 0),
        totalPrice: Number(totals?.totalPrice || 0),
      },
      address: {
        fullName: address.fullName,
        phone: address.phone,
        email: address.email,
        address: address.address,
        city: address.city,
        pincode: address.pincode,
        country: address.country,
      },
      paymentMethod: paymentMethod || "card",
      orderNotes: orderNotes || "",
      status: "Pending",
    });

    return Response.json({ ok: true, orderId: order.orderId }, { status: 201 });

  } catch (err) {
    console.error("ORDER_CREATE_ERROR:", err);
    return Response.json(
      { ok: false, message: err.message || "Server error" },
      { status: 500 }
    );
  }
}

/* ================= GET ALL ORDERS ================= */
export async function GET() {
  try {
    await dbConnect();
    const orders = await Order.find().sort({ createdAt: -1 }).lean();
    return Response.json({ ok: true, orders });
  } catch (err) {
    console.error("ORDER_LIST_ERROR:", err);
    return Response.json(
      { ok: false, message: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
