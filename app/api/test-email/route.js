// /app/api/test-email/route.js
import nodemailer from "nodemailer";

export async function GET() {
  try {
    console.log("📧 Testing email configuration...");
    console.log("SMTP Email:", process.env.SMTP_EMAIL);
    console.log("Admin Email:", process.env.ADMIN_EMAIL);
    
    // 1. Transporter create करें
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // 2. SMTP connection test करें
    console.log("🔌 Testing SMTP connection...");
    await transporter.verify();
    console.log("✅ SMTP Connection successful!");

    // 3. Test email भेजें
    console.log("📤 Sending test email...");
    
    const mailOptions = {
      from: `"ED Pharma" <${process.env.SMTP_EMAIL}>`,
      to: process.env.ADMIN_EMAIL,  // Admin को भेजें
      subject: "✅ ED Pharma - Email Test Successful",
      text: "Congratulations! Your ED Pharma email system is working perfectly.",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h1 style="color: #0A4C89;">✅ ED Pharma Email Test</h1>
          <p>Your email configuration is working correctly!</p>
          <div style="background-color: #f0f9ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3>Configuration Details:</h3>
            <p><strong>From:</strong> ${process.env.SMTP_EMAIL}</p>
            <p><strong>To:</strong> ${process.env.ADMIN_EMAIL}</p>
            <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          </div>
          <p>Now you can receive order confirmations and notifications.</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Test email sent! Message ID:", info.messageId);

    return Response.json({
      success: true,
      message: "Email test successful! Check your inbox.",
      details: {
        from: process.env.SMTP_EMAIL,
        to: process.env.ADMIN_EMAIL,
        messageId: info.messageId,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error("❌ Email test failed:", error.message);
    
    return Response.json({
      success: false,
      error: error.message,
      solution: "Check if 2-Step Verification is ON and using App Password",
      yourConfig: {
        smtpEmail: process.env.SMTP_EMAIL,
        hasPassword: !!process.env.SMTP_PASSWORD,
        adminEmail: process.env.ADMIN_EMAIL
      }
    }, { status: 500 });
  }
}