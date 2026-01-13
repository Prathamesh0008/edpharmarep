//ed_pharma/app/api/orders/create/route.js
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

    // Create order
    const order = await Order.create({
      userId,
      userEmail: userEmail,
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

    // 📧 EMAIL 1: Send order confirmation to USER
    const userEmailHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #0A4C89; margin: 0;">ED Pharma</h1>
          <p style="color: #666; margin-top: 5px;">Healthcare Solutions</p>
        </div>
        
        <div style="background-color: #f0f9ff; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #0A4C89; margin: 0 0 10px 0;">✅ Order Confirmation</h2>
          <p style="margin: 0;">Thank you for your order! Your order has been successfully placed and is being processed.</p>
        </div>
        
        <div style="margin-bottom: 20px;">
          <h3 style="color: #333; border-bottom: 2px solid #0A4C89; padding-bottom: 5px;">Order Details</h3>
          <p><strong>Order ID:</strong> ${order.orderId}</p>
          <p><strong>Order Date:</strong> ${new Date().toLocaleDateString('en-IN')}</p>
          <p><strong>Payment Method:</strong> ${paymentMethod === 'cod' ? 'Cash on Delivery' : paymentMethod.toUpperCase()}</p>
        </div>
        
        <div style="margin-bottom: 20px;">
          <h3 style="color: #333; border-bottom: 2px solid #0A4C89; padding-bottom: 5px;">Order Summary</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f8f9fa;">
                <th style="text-align: left; padding: 10px; border-bottom: 1px solid #ddd;">Product</th>
                <th style="text-align: left; padding: 10px; border-bottom: 1px solid #ddd;">Quantity</th>
                <th style="text-align: left; padding: 10px; border-bottom: 1px solid #ddd;">Price</th>
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
        
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <h4 style="color: #333; margin-top: 0;">What's Next?</h4>
          <ul style="margin-bottom: 0;">
            <li>You will receive updates about your order status via email</li>
            <li>Our team will verify and process your order within 24 hours</li>
            <li>For any queries, contact us at ${process.env.SMTP_EMAIL}</li>
          </ul>
        </div>
        
        <div style="text-align: center; color: #666; font-size: 14px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
          <p style="margin: 0;">Thank you for choosing ED Pharma!</p>
          <p style="margin: 5px 0 0 0;">
            <strong>ED Pharma Team</strong><br/>
            Healthcare Solutions • Discreet Packaging • Fast Delivery
          </p>
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
          <p><strong>Customer Email:</strong> ${userEmail}</p>
          <p><strong>Customer ID:</strong> ${userId}</p>
          <p><strong>Order Date:</strong> ${new Date().toLocaleDateString('en-IN')} ${new Date().toLocaleTimeString('en-IN')}</p>
        </div>
        
        <div style="margin-bottom: 20px;">
          <h3 style="color: #333; border-bottom: 2px solid #ff6b6b; padding-bottom: 5px;">Order Summary</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f8f9fa;">
                <th style="text-align: left; padding: 10px; border-bottom: 1px solid #ddd;">Product</th>
                <th style="text-align: left; padding: 10px; border-bottom: 1px solid #ddd;">Quantity</th>
                <th style="text-align: left; padding: 10px; border-bottom: 1px solid #ddd;">Price</th>
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
                    <td style="padding: 10px; border-bottom: 1px solid #ddd;">₹${i.price}/unit</td>
                    <td style="padding: 10px; border-bottom: 1px solid #ddd;">₹${Number(i.price) * Number(i.qty)}</td>
                  </tr>
                `
                )
                .join("")}
            </tbody>
          </table>
          <div style="text-align: right; margin-top: 15px;">
            <p style="font-size: 20px; font-weight: bold; color: #ff6b6b;">
              Total Amount: ₹${totals.totalPrice}
            </p>
          </div>
          <div style="background-color: #f8f9fa; padding: 10px; border-radius: 5px; margin-top: 10px;">
            <p style="margin: 0;"><strong>Summary:</strong> ${items.length} items • ${totals.totalQty} total units • ₹${totals.totalPrice} total</p>
          </div>
        </div>
        
        <div style="margin-bottom: 20px;">
          <h3 style="color: #333; border-bottom: 2px solid #ff6b6b; padding-bottom: 5px;">Delivery Address</h3>
          <p>
            <strong>${address.fullName}</strong><br/>
            ${address.address}<br/>
            ${address.city} - ${address.pincode}<br/>
            ${address.country}<br/>
            📞 ${address.phone}
          </p>
        </div>
        
        <div style="margin-bottom: 20px;">
          <h3 style="color: #333; border-bottom: 2px solid #ff6b6b; padding-bottom: 5px;">Payment Information</h3>
          <p><strong>Method:</strong> ${paymentMethod === 'cod' ? 'Cash on Delivery' : paymentMethod.toUpperCase()}</p>
          <p><strong>Status:</strong> Pending</p>
        </div>
        
        <div style="background-color: #ffebee; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <h4 style="color: #d32f2f; margin-top: 0;">Action Required</h4>
          <ul style="margin-bottom: 0;">
            <li>Verify the order details in admin panel</li>
            <li>Process the order within 24 hours</li>
            <li>Update order status once shipped</li>
            <li>Contact customer if any issues: ${address.phone}</li>
          </ul>
        </div>
        
        <div style="text-align: center; color: #666; font-size: 14px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
          <p style="margin: 0;">This is an automated notification from ED Pharma Order System</p>
          <p style="margin: 5px 0 0 0;">Order ID: ${order.orderId} | Time: ${new Date().toLocaleTimeString('en-IN')}</p>
        </div>
      </div>
    `;

    // Send both emails in parallel (non-blocking)
    // We don't wait for email success to respond to user
    Promise.allSettled([
      sendEmail(
        userEmail,
        `✅ Order Confirmation - ${order.orderId} - ED Pharma`,
        userEmailHtml
      ),
      sendEmail(
        process.env.ADMIN_EMAIL,
        `🚨 New Order - ${order.orderId} - ED Pharma`,
        adminEmailHtml
      ),
    ]).then((results) => {
      console.log("📧 Email sending results:", results);
    });

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

//ed_pharma/app/api/orders/create/route.js
// import dbConnect from "@/lib/db";
// import Order from "../../../models/Order";
// import nodemailer from "nodemailer";
// import { cookies } from "next/headers";
// import { jwtVerify } from "jose";


// function makeOrderId() {
//   const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
//   return `ORD-${Date.now()}-${rand}`;
// }
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.SMTP_EMAIL,
//     pass: process.env.SMTP_PASSWORD,
//   },
// });





// /* ================= CREATE ORDER ================= */
// export async function POST(req) {
//   try {
//     const body = await req.json();
//   const { items, totals, address, paymentMethod } = body;
//   const secret = new TextEncoder().encode(process.env.JWT_SECRET);


//   const cookieStore = await cookies();
// const token = cookieStore.get("auth")?.value;

// if (!token) {
//   return Response.json(
//     { ok: false, message: "Please login to continue" },
//     { status: 401 }
//   );
// }

// let userId;
// let userEmail;

// try {
//   const { payload } = await jwtVerify(token, secret);
//   userId = payload.id;
//   userEmail = payload.email;
// } catch {
//   return Response.json(
//     { ok: false, message: "Session expired. Please login again" },
//     { status: 401 }
//   );
// }



//     // ✅ validation: items
//     if (!Array.isArray(items) || items.length === 0) {
//       return Response.json(
//         { ok: false, message: "Cart is empty" },
//         { status: 400 }
//       );
//     }




//     // ✅ validation: address
//     if (
//       !address?.fullName ||
//       !address?.phone ||
//       !address?.address ||
//       !address?.city ||
//       !address?.pincode ||
//       !address?.country
//     ) {
//       return Response.json(
//         { ok: false, message: "Address incomplete" },
//         { status: 400 }
//       );
//     }

//     //email validation 
    

// // if (!userId) {
// //   return Response.json(
// //     { ok: false, message: "User not authenticated" },
// //     { status: 401 }
// //   );
// // }



//     // ✅ enforce min 50 qty
//     const invalid = items.find((i) => Number(i.qty) < 50);
//     if (invalid) {
//       return Response.json(
//         {
//           ok: false,
//           message: `Minimum order quantity is 50 per item. "${invalid.name}" has qty ${Number(
//             invalid.qty
//           )}.`,
//         },
//         { status: 400 }
//       );
//     }

//     await dbConnect();

//     const order = await Order.create({
//   userId,
//  userEmail: userEmail,   // ✅ THIS IS THE FIX
//   orderId: makeOrderId(),
//   items: items.map((i) => ({
//     slug: i.slug,
//     name: i.name,
//     qty: Number(i.qty),
//     price: Number(i.price || 0),
//     image: i.image || "",
//   })),
//   totals: {
//     totalDistinct: Number(totals?.totalDistinct || items.length),
//     totalQty: Number(totals?.totalQty || 0),
//     totalPrice: Number(totals?.totalPrice || 0),
//   },
//   address,
//   paymentMethod: paymentMethod || "cod",
//   status: "Pending",
// });



//     // 📧 SEND ORDER CONFIRMATION EMAIL (non-blocking)
// try {
//   await transporter.sendMail({
//     from: `"ED Pharma" <${process.env.SMTP_EMAIL}>`,
//    to: userEmail,
//     subject: "✅ Order Successful – ED Pharma",
//     html: `
//       <div style="font-family:Arial,sans-serif;line-height:1.6">
//         <h2>Thank you for your order!</h2>

//         <p>Your order <strong>${order.orderId}</strong> has been placed successfully.</p>

//         <h3>Order Summary</h3>
//         <ul>
//           ${items
//             .map(
//               (i) =>
//                 `<li>${i.name} × ${i.qty} — ₹${Number(i.price) * Number(i.qty)}</li>`
//             )
//             .join("")}
//         </ul>

//         <p><strong>Total:</strong> ₹${totals.totalPrice}</p>

//         <h4>Delivery Address</h4>
//         <p>
//           ${address.fullName}<br/>
//           ${address.address}, ${address.city} - ${address.pincode}<br/>
//           ${address.country}<br/>
//           Phone: ${address.phone}
//         </p>

//         <p style="margin-top:20px">
//           Regards,<br/>
//           <strong>ED Pharma Team</strong>
//         </p>
//       </div>
//     `,
//   });
// } catch (mailErr) {
//   console.error("ORDER_EMAIL_FAILED:", mailErr);
// }

// // ✅ FINAL RESPONSE
// return Response.json(
//   { ok: true, orderId: order.orderId },
//   { status: 201 }
// );

//   } catch (err) {
//     console.error("ORDER_CREATE_ERROR:", err);

//     return new Response(
//       JSON.stringify({ ok: false, message: err.message || "Server error" }),
//       { status: 500, headers: { "Content-Type": "application/json" } }
//     );
//   }
// }

// /* ================= GET ALL ORDERS ================= */
// export async function GET() {
//   try {
//     await dbConnect();

//     const orders = await Order.find()
//       .sort({ createdAt: -1 })
//       .lean();

//     return Response.json({ ok: true, orders });
//   } catch (err) {
//     console.error("ORDER_LIST_ERROR:", err);
//     return Response.json(
//       { ok: false, message: "Failed to fetch orders" },
//       { status: 500 }
//     );
//   }
// }
