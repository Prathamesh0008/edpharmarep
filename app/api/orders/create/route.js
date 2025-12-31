//ed_pharma\app\api\orders\route.js
import dbConnect from "@/lib/db";
import Order from "../../../models/Order";
import nodemailer from "nodemailer";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";


function makeOrderId() {
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `ORD-${Date.now()}-${rand}`;
}
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});





/* ================= CREATE ORDER ================= */
export async function POST(req) {
  try {
    const body = await req.json();
  const { items, totals, address, paymentMethod } = body;
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
let userEmail;

try {
  const { payload } = await jwtVerify(token, secret);
  userId = payload.id;
  userEmail = payload.email;
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
      !address?.address ||
      !address?.city ||
      !address?.pincode ||
      !address?.country
    ) {
      return Response.json(
        { ok: false, message: "Address incomplete" },
        { status: 400 }
      );
    }

    //email validation 
    

// if (!userId) {
//   return Response.json(
//     { ok: false, message: "User not authenticated" },
//     { status: 401 }
//   );
// }



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

    const order = await Order.create({
  userId,
 userEmail: userEmail,   // ✅ THIS IS THE FIX
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
  address,
  paymentMethod: paymentMethod || "cod",
  status: "Pending",
});



    // 📧 SEND ORDER CONFIRMATION EMAIL (non-blocking)
try {
  await transporter.sendMail({
    from: `"ED Pharma" <${process.env.SMTP_EMAIL}>`,
   to: userEmail,
    subject: "✅ Order Successful – ED Pharma",
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6">
        <h2>Thank you for your order!</h2>

        <p>Your order <strong>${order.orderId}</strong> has been placed successfully.</p>

        <h3>Order Summary</h3>
        <ul>
          ${items
            .map(
              (i) =>
                `<li>${i.name} × ${i.qty} — ₹${Number(i.price) * Number(i.qty)}</li>`
            )
            .join("")}
        </ul>

        <p><strong>Total:</strong> ₹${totals.totalPrice}</p>

        <h4>Delivery Address</h4>
        <p>
          ${address.fullName}<br/>
          ${address.address}, ${address.city} - ${address.pincode}<br/>
          ${address.country}<br/>
          Phone: ${address.phone}
        </p>

        <p style="margin-top:20px">
          Regards,<br/>
          <strong>ED Pharma Team</strong>
        </p>
      </div>
    `,
  });
} catch (mailErr) {
  console.error("ORDER_EMAIL_FAILED:", mailErr);
}

// ✅ FINAL RESPONSE
return Response.json(
  { ok: true, orderId: order.orderId },
  { status: 201 }
);

  } catch (err) {
    console.error("ORDER_CREATE_ERROR:", err);

    return new Response(
      JSON.stringify({ ok: false, message: err.message || "Server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

/* ================= GET ALL ORDERS ================= */
export async function GET() {
  try {
    await dbConnect();

    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .lean();

    return Response.json({ ok: true, orders });
  } catch (err) {
    console.error("ORDER_LIST_ERROR:", err);
    return Response.json(
      { ok: false, message: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
