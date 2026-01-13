// /app/api/contact/route.js
import nodemailer from "nodemailer";

// Initialize email transporter
let transporter;
try {
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });
  
  console.log("✅ Contact form email transporter ready");
} catch (error) {
  console.error("❌ Contact form email transporter error:", error);
  transporter = null;
}

// Helper function to send email
async function sendEmail(to, subject, html) {
  if (!transporter) {
    console.error("❌ Email transporter not initialized");
    return false;
  }

  try {
    const info = await transporter.sendMail({
      from: `"ED Pharma" <${process.env.SMTP_EMAIL}>`,
      to,
      subject,
      html,
    });
    console.log(`✅ Contact email sent to ${to}`, info.messageId);
    return true;
  } catch (error) {
    console.error(`❌ Failed to send contact email to ${to}:`, error.message);
    return false;
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, phone, message } = body;

    console.log("📨 Contact form submission:", { name, email, phone });

    // Validation
    if (!name || !email || !phone || !message) {
      return Response.json(
        { 
          success: false, 
          message: "All fields are required" 
        },
        { status: 400 }
      );
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      return Response.json(
        { 
          success: false, 
          message: "Please enter a valid email address" 
        },
        { status: 400 }
      );
    }

    // Get current date and time
    const submissionDate = new Date().toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const submissionTime = new Date().toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    // Email 1: Confirmation to User
    const userEmailHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Message Received - ED Pharma</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #0A4C89, #0D5FA8); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">ED Pharma</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0 0;">Healthcare Solutions</p>
    </div>
    
    <div style="background-color: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0; border-top: none;">
        <div style="text-align: center; margin-bottom: 30px;">
            <div style="background-color: #d4edda; color: #155724; padding: 15px; border-radius: 8px; display: inline-block;">
                <h2 style="margin: 0; font-size: 24px;">✅ Message Received!</h2>
            </div>
        </div>
        
        <div style="background-color: white; padding: 20px; border-radius: 8px; margin-bottom: 25px; border-left: 4px solid #0A4C89;">
            <h3 style="color: #0A4C89; margin-top: 0;">Thank You for Contacting Us</h3>
            <p>Hello <strong>${name}</strong>,</p>
            <p>We've received your message and our team will get back to you within 24 hours.</p>
            
            <div style="background-color: #f0f9ff; padding: 15px; border-radius: 6px; margin-top: 15px;">
                <p style="margin: 0; font-size: 14px;">
                    <strong>Reference:</strong> CONT-${Date.now().toString().slice(-6)}<br>
                    <strong>Submitted:</strong> ${submissionDate} at ${submissionTime}
                </p>
            </div>
        </div>
        
        <div style="background-color: white; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
            <h3 style="color: #0A4C89; margin-top: 0;">Your Message Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: 10px; border-bottom: 1px solid #f0f0f0; font-weight: bold; width: 120px;">Name:</td>
                    <td style="padding: 10px; border-bottom: 1px solid #f0f0f0;">${name}</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border-bottom: 1px solid #f0f0f0; font-weight: bold;">Email:</td>
                    <td style="padding: 10px; border-bottom: 1px solid #f0f0f0;">${email}</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border-bottom: 1px solid #f0f0f0; font-weight: bold;">Phone:</td>
                    <td style="padding: 10px; border-bottom: 1px solid #f0f0f0;">${phone}</td>
                </tr>
                <tr>
                    <td style="padding: 10px; font-weight: bold; vertical-align: top;">Message:</td>
                    <td style="padding: 10px;">${message.replace(/\n/g, '<br>')}</td>
                </tr>
            </table>
        </div>
        
        <div style="background-color: #e8f4fd; padding: 20px; border-radius: 8px; margin-bottom: 25px; border-left: 4px solid #0A4C89;">
            <h4 style="color: #0A4C89; margin-top: 0;">What Happens Next?</h4>
            <ul style="margin-bottom: 0;">
                <li>Our support team will review your message</li>
                <li>You will receive a response within 24 hours</li>
                <li>For urgent matters, call: (+91)-9525446820</li>
                <li>Check your spam folder if you don't see our response</li>
            </ul>
        </div>
        
        <div style="text-align: center; color: #666; font-size: 14px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
            <p style="margin: 0 0 10px 0;">Thank you for reaching out to ED Pharma!</p>
            <p style="margin: 0; font-weight: bold;">Healthcare Solutions • Discreet Packaging • Fast Delivery</p>
        </div>
    </div>
</body>
</html>
    `;

    // Email 2: Notification to Admin
    const adminEmailHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Contact Form Submission - ED Pharma</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #ff6b6b, #ff5252); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">📨 NEW CONTACT SUBMISSION</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 18px; font-weight: bold;">From: ${name}</p>
    </div>
    
    <div style="background-color: #fff5f5; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #ffcccc; border-top: none;">
        <div style="background-color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #ff6b6b;">
            <h3 style="color: #ff6b6b; margin-top: 0;">Contact Form Submission Details</h3>
            <p><strong>Submitted:</strong> ${submissionDate} at ${submissionTime}</p>
            <p><strong>Reference ID:</strong> CONT-${Date.now().toString().slice(-6)}</p>
        </div>
        
        <div style="background-color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #ff6b6b; margin-top: 0;">Contact Information</h3>
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: 10px; border-bottom: 1px solid #ffe6e6; font-weight: bold; width: 100px;">Name:</td>
                    <td style="padding: 10px; border-bottom: 1px solid #ffe6e6;">${name}</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border-bottom: 1px solid #ffe6e6; font-weight: bold;">Email:</td>
                    <td style="padding: 10px; border-bottom: 1px solid #ffe6e6;">
                        ${email}
                        <a href="mailto:${email}" style="color: #0A4C89; margin-left: 10px;">✉️ Reply</a>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 10px; border-bottom: 1px solid #ffe6e6; font-weight: bold;">Phone:</td>
                    <td style="padding: 10px; border-bottom: 1px solid #ffe6e6;">
                        ${phone}
                        <a href="tel:${phone}" style="color: #0A4C89; margin-left: 10px;">📞 Call</a>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 10px; font-weight: bold; vertical-align: top;">Message:</td>
                    <td style="padding: 10px; white-space: pre-wrap; background-color: #f8f9fa; border-radius: 5px;">
                        ${message.replace(/\n/g, '<br>')}
                    </td>
                </tr>
            </table>
        </div>
        
        <div style="background-color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #ff6b6b; margin-top: 0;">Quick Actions</h3>
            <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-top: 10px;">
                <a href="mailto:${email}" 
                   style="background-color: #0A4C89; color: white; padding: 8px 15px; border-radius: 5px; text-decoration: none; font-size: 14px;">
                    ✉️ Reply via Email
                </a>
                <a href="tel:${phone}" 
                   style="background-color: #10b981; color: white; padding: 8px 15px; border-radius: 5px; text-decoration: none; font-size: 14px;">
                    📞 Call Customer
                </a>
                <a href="https://wa.me/${phone.replace(/\D/g, '')}" 
                   style="background-color: #25D366; color: white; padding: 8px 15px; border-radius: 5px; text-decoration: none; font-size: 14px;">
                    💬 WhatsApp
                </a>
            </div>
        </div>
        
        <div style="background-color: #ffebee; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #ff6b6b;">
            <h4 style="color: #d32f2f; margin-top: 0;">⚠️ Action Required</h4>
            <ul style="margin-bottom: 0;">
                <li>Respond to the customer within 24 hours</li>
                <li>Update CRM if you have one</li>
                <li>Forward to relevant department if needed</li>
                <li>Check for similar recent inquiries</li>
            </ul>
        </div>
        
        <div style="text-align: center; color: #666; font-size: 14px; padding-top: 20px; border-top: 1px solid #ffcccc;">
            <p style="margin: 0;">This is an automated notification from ED Pharma Contact Form</p>
            <p style="margin: 5px 0 0 0;">Submitted at ${submissionTime} on ${submissionDate}</p>
        </div>
    </div>
</body>
</html>
    `;

    // Send emails (non-blocking)
    if (transporter) {
      Promise.allSettled([
        sendEmail(
          email,  // Send confirmation to user
          `✅ Message Received - ED Pharma`,
          userEmailHtml
        ),
        sendEmail(
          process.env.ADMIN_EMAIL,
          `📨 New Contact Form Submission - ${name} - ED Pharma`,
          adminEmailHtml
        ),
      ]).then((results) => {
        results.forEach((result, index) => {
          const emailType = index === 0 ? "User" : "Admin";
          if (result.status === 'fulfilled') {
            console.log(`✅ Contact ${emailType} email sent successfully`);
          } else {
            console.error(`❌ Contact ${emailType} email failed:`, result.reason);
          }
        });
      });
    } else {
      console.warn("⚠️ Email transporter not available. Skipping contact emails.");
    }

    // Return success response
    return Response.json({
      success: true,
      message: "Message sent successfully! Check your email for confirmation.",
      reference: `CONT-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("❌ Contact form submission error:", error);
    
    return Response.json(
      { 
        success: false, 
        message: "Failed to send message. Please try again later." 
      },
      { status: 500 }
    );
  }
}