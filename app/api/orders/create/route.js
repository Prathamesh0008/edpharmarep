// app/api/orders/create/route.js
import dbConnect from "@/lib/db";
import Order from "../../../models/Order";
import nodemailer from "nodemailer";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

function makeOrderId() {
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `ORD-${Date.now()}-${rand}`;
}

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

// Helper function to send email (non-blocking)
async function sendEmail(to, subject, html) {
  try {
    await transporter.sendMail({
      from: `"ED Pharma" <${process.env.SMTP_EMAIL}>`,
      to,
      subject,
      html,
    });
    console.log(`✅ Email sent to ${to}`);
    return true;
  } catch (error) {
    console.error(`❌ Email failed to ${to}:`, error);
    return false;
  }
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

    // Format payment method for display
    const paymentDisplay = {
      card: "Credit/Debit Card",
      bank: "Bank Transfer",
      crypto: "Cryptocurrency",
    }[paymentMethod] || paymentMethod.toUpperCase();

    // 📧 EMAIL 1: Send order confirmation to USER
    const userEmailHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #0A4C89; margin: 0;">ED Pharma</h1>
          <p style="color: #666; margin-top: 5px;">Healthcare Solutions</p>
        </div>
        
        <div style="background-color: #f0f9ff; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #0A4C89; margin: 0 0 10px 0;">✅ Order Confirmation</h2>
          <p style="margin: 0;">Thank you for your order, ${address.fullName}! Your order has been successfully placed and is being processed.</p>
        </div>
        
        <div style="margin-bottom: 20px;">
          <h3 style="color: #333; border-bottom: 2px solid #0A4C89; padding-bottom: 5px;">Order Details</h3>
          <p><strong>Order ID:</strong> ${order.orderId}</p>
          <p><strong>Order Date:</strong> ${new Date().toLocaleDateString('en-IN')}</p>
          <p><strong>Payment Method:</strong> ${paymentDisplay}</p>
        </div>
        
        <div style="margin-bottom: 20px;">
          <h3 style="color: #333; border-bottom: 2px solid #0A4C89; padding-bottom: 5px;">Order Summary</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f8f9fa;">
                <th style="text-align: left; padding: 10px; border-bottom: 1px solid #ddd;">Product</th>
                <th style="text-align: left; padding: 10px; border-bottom: 1px solid #ddd;">Quantity</th>
                <th style="text-align: left; padding: 10px; border-bottom: 1px solid #ddd;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${items
                .map(
                  (i) => `
                  <tr>
                    <td style="padding: 10px; border-bottom: 1px solid #ddd;">${i.name}</td>
                    <td style="padding: 10px; border-bottom: 1px solid #ddd;">${i.qty} units</td>
                    <td style="padding: 10px; border-bottom: 1px solid #ddd;">₹${Number(i.price) * Number(i.qty)}</td>
                  </tr>
                `
                )
                .join("")}
            </tbody>
          </table>
          <div style="text-align: right; margin-top: 15px;">
            <p style="font-size: 18px; font-weight: bold; color: #0A4C89;">
              Total Amount: ₹${totals.totalPrice}
            </p>
          </div>
        </div>
        
        ${orderNotes ? `
        <div style="margin-bottom: 20px; background-color: #fff3cd; border: 1px solid #ffeeba; padding: 15px; border-radius: 8px;">
          <h3 style="color: #856404; margin: 0 0 10px 0;">📝 Your Order Notes</h3>
          <p style="color: #856404; margin: 0; font-style: italic; background-color: white; padding: 10px; border-radius: 5px;">
            "${orderNotes}"
          </p>
        </div>
        ` : ''}
        
        <div style="margin-bottom: 20px;">
          <h3 style="color: #333; border-bottom: 2px solid #0A4C89; padding-bottom: 5px;">Delivery Address</h3>
          <p>
            <strong>${address.fullName}</strong><br/>
            ${address.address}<br/>
            ${address.city} - ${address.pincode}<br/>
            ${address.country}<br/>
            📞 ${address.phone}
          </p>
        </div>
        
        <div style="text-align: center; color: #666; font-size: 14px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
          <p>Thank you for choosing ED Pharma!</p>
          <p><strong>ED Pharma Team</strong></p>
        </div>
      </div>
    `;

    // 📧 EMAIL 2: Send order notification to ADMIN
    const adminEmailHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 20px; background-color: #ff6b6b; color: white; padding: 15px; border-radius: 8px;">
          <h1 style="margin: 0;">🚨 NEW ORDER RECEIVED</h1>
          <p style="margin: 5px 0 0 0; font-size: 18px; font-weight: bold;">Order ID: ${order.orderId}</p>
        </div>
        
        <div style="margin-bottom: 20px;">
          <h3 style="color: #333; border-bottom: 2px solid #ff6b6b; padding-bottom: 5px;">Customer Information</h3>
          <p><strong>Name:</strong> ${address.fullName}</p>
          <p><strong>Email:</strong> ${address.email}</p>
          <p><strong>Phone:</strong> ${address.phone}</p>
          <p><strong>Payment:</strong> ${paymentDisplay}</p>
        </div>
        
        <div style="margin-bottom: 20px;">
          <h3 style="color: #333; border-bottom: 2px solid #ff6b6b; padding-bottom: 5px;">Order Summary</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f8f9fa;">
                <th style="text-align: left; padding: 10px;">Product</th>
                <th style="text-align: left; padding: 10px;">Qty</th>
                <th style="text-align: left; padding: 10px;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${items
                .map(
                  (i) => `
                  <tr>
                    <td style="padding: 10px; border-bottom: 1px solid #ddd;">${i.name}</td>
                    <td style="padding: 10px; border-bottom: 1px solid #ddd;">${i.qty}</td>
                    <td style="padding: 10px; border-bottom: 1px solid #ddd;">₹${Number(i.price) * Number(i.qty)}</td>
                  </tr>
                `
                )
                .join("")}
            </tbody>
          </table>
          <p style="font-size: 18px; font-weight: bold; color: #ff6b6b; text-align: right;">
            Total: ₹${totals.totalPrice}
          </p>
        </div>
        
        ${orderNotes ? `
        <div style="margin-bottom: 20px; background-color: #fff3cd; border: 1px solid #ffeeba; padding: 15px; border-radius: 8px;">
          <h3 style="color: #856404;">📝 Customer Notes</h3>
          <p style="color: #856404;">"${orderNotes}"</p>
        </div>
        ` : ''}
        
        <div style="background-color: #ffebee; padding: 15px; border-radius: 8px;">
          <h4 style="color: #d32f2f; margin-top: 0;">Action Required</h4>
          <p>Process this order within 24 hours.</p>
        </div>
      </div>
    `;

    // Send emails
    Promise.allSettled([
      sendEmail(address.email, `Order Confirmation - ${order.orderId}`, userEmailHtml),
      sendEmail(process.env.ADMIN_EMAIL, `New Order - ${order.orderId}`, adminEmailHtml),
    ]);

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