import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const { orderId, customerEmail, customerName, totalAmount, paymentMethod, items } = await request.json();

    console.log('Sending receipt for order:', orderId, 'to:', customerEmail);

    // Validate required fields
    if (!orderId || !customerEmail) {
      return Response.json(
        { success: false, message: 'Order ID and customer email are required' },
        { status: 400 }
      );
    }

    // Gmail SMTP configuration - using your credentials
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_EMAIL || 'payalnalawade142@gmail.com',
        pass: process.env.SMTP_PASSWORD || 'uamq bhym cvit cpvh',
      },
    });

    // Format order items for email
    let itemsHtml = '';
    let itemsText = '';
    if (items && Array.isArray(items)) {
      itemsHtml = items.map(item => 
        `<tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity || item.qty || 1}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price || 0}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">₹${item.total || (item.price * (item.quantity || item.qty || 1))}</td>
        </tr>`
      ).join('');
      
      itemsText = items.map(item => 
        `- ${item.name}: ${item.quantity || item.qty || 1} x ₹${item.price || 0} = ₹${item.total || (item.price * (item.quantity || item.qty || 1))}`
      ).join('\n');
    }

    // Email HTML template
    const htmlTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation - ${orderId}</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f5f7fa; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); }
          .header { background: linear-gradient(135deg, #0A4C89 0%, #0D5FA8 100%); color: white; padding: 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 28px; font-weight: 600; }
          .header p { margin: 10px 0 0; opacity: 0.9; font-size: 16px; }
          .content { padding: 30px; }
          .order-info { background: #f8fafc; border-radius: 8px; padding: 20px; margin-bottom: 25px; border: 1px solid #e2e8f0; }
          .info-row { display: flex; justify-content: space-between; margin-bottom: 12px; }
          .info-label { color: #64748b; font-weight: 500; }
          .info-value { color: #1e293b; font-weight: 600; }
          .total-row { border-top: 2px solid #e2e8f0; padding-top: 12px; margin-top: 12px; font-size: 18px; }
          .table-container { overflow-x: auto; margin: 25px 0; }
          table { width: 100%; border-collapse: collapse; }
          th { background: #f1f5f9; color: #475569; font-weight: 600; text-align: left; padding: 12px; border-bottom: 2px solid #e2e8f0; }
          td { padding: 12px; border-bottom: 1px solid #e2e8f0; }
          .status-badge { display: inline-block; background: #10b981; color: white; padding: 6px 16px; border-radius: 20px; font-size: 14px; font-weight: 600; }
          .footer { text-align: center; padding: 25px 30px; background: #f8fafc; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 14px; }
          .cta-button { display: inline-block; background: #0A4C89; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; margin-top: 10px; }
          .thank-you { font-size: 18px; color: #0A4C89; font-weight: 600; margin-bottom: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Order Confirmed!</h1>
            <p>Thank you for shopping with EdPharma</p>
          </div>
          
          <div class="content">
            <div class="thank-you">Dear ${customerName || 'Valued Customer'},</div>
            <p>Your order has been successfully placed and is now being processed. Here's a summary of your order:</p>
            
            <div class="order-info">
              <div class="info-row">
                <span class="info-label">Order Number</span>
                <span class="info-value">${orderId}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Order Date</span>
                <span class="info-value">${new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Payment Method</span>
                <span class="info-value">${paymentMethod === 'cod' ? 'Cash on Delivery' : 
                                           paymentMethod === 'upi' ? 'UPI' : 
                                           paymentMethod === 'card' ? 'Credit/Debit Card' : 
                                           paymentMethod === 'wallet' ? 'Wallet' : paymentMethod || 'Cash on Delivery'}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Order Status</span>
                <span class="status-badge">Confirmed</span>
              </div>
            </div>
            
            ${itemsHtml ? `
            <div class="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th style="text-align: center;">Quantity</th>
                    <th style="text-align: right;">Unit Price</th>
                    <th style="text-align: right;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                  <tr>
                    <td colspan="3" style="text-align: right; font-weight: 600; padding-top: 20px;">Grand Total:</td>
                    <td style="text-align: right; font-weight: 700; font-size: 18px; padding-top: 20px;">₹${totalAmount || '0'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            ` : `
            <div class="info-row total-row">
              <span class="info-label">Total Amount</span>
              <span class="info-value" style="color: #0A4C89; font-size: 20px;">₹${totalAmount || '0'}</span>
            </div>
            `}
            
            <p style="text-align: center; margin-top: 30px;">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/orders/${orderId}" class="cta-button">
                View Order Details
              </a>
            </p>
            
            <p style="margin-top: 30px; color: #475569;">
              <strong>Delivery Information:</strong><br>
              We'll notify you when your order ships. Estimated delivery time is 2-3 business days.
            </p>
            
            <p style="color: #64748b; font-size: 14px; margin-top: 25px;">
              Need help? Contact our support team at 
              <a href="mailto:${process.env.ADMIN_EMAIL || 'info.edpharmacy@gmail.com'}" style="color: #0A4C89;">
                ${process.env.ADMIN_EMAIL || 'info.edpharmacy@gmail.com'}
              </a>
            </p>
          </div>
          
          <div class="footer">
            <p>Thank you for choosing EdPharma – Your trusted healthcare partner</p>
            <p>© ${new Date().getFullYear()} EdPharma. All rights reserved.</p>
            <p style="font-size: 12px; margin-top: 10px;">
              This is an automated email. Please do not reply to this address.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Plain text version
    const textTemplate = `
ORDER CONFIRMATION - ${orderId}

Dear ${customerName || 'Valued Customer'},

Thank you for your order with EdPharma!

ORDER DETAILS:
Order Number: ${orderId}
Order Date: ${new Date().toLocaleDateString()}
Payment Method: ${paymentMethod === 'cod' ? 'Cash on Delivery' : paymentMethod || 'Cash on Delivery'}
Status: Confirmed

${itemsText ? `ORDER ITEMS:\n${itemsText}\n\n` : ''}Total Amount: ₹${totalAmount || '0'}

You can view your order details here:
${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/orders/${orderId}

Delivery Information:
We'll notify you when your order ships. Estimated delivery time is 2-3 business days.

Need help? Contact: ${process.env.ADMIN_EMAIL || 'info.edpharmacy@gmail.com'}

Thank you for choosing EdPharma!
© ${new Date().getFullYear()} EdPharma. All rights reserved.
    `;

    // Send email
    const mailOptions = {
      from: `"EdPharma" <${process.env.SMTP_EMAIL || 'payalnalawade142@gmail.com'}>`,
      to: customerEmail,
      subject: `Order Confirmation #${orderId} - EdPharma`,
      html: htmlTemplate,
      text: textTemplate,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully to:', customerEmail, 'Message ID:', info.messageId);

    return Response.json({
      success: true,
      message: 'Email receipt sent successfully',
      messageId: info.messageId,
    });

  } catch (error) {
    console.error('❌ Error sending email:', error);
    return Response.json(
      { 
        success: false, 
        message: 'Failed to send email receipt', 
        error: error.message,
        details: 'Check SMTP configuration and credentials'
      },
      { status: 500 }
    );
  }
}