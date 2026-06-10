// Email configuration moved to mailer.js using Nodemailer
const FROM = process.env.FROM_EMAIL || process.env.SMTP_USER || 'Achaarwaala';

const SHARED_FOOTER = `
  <div style="
    text-align: center;
    padding: 24px 20px;
    color: #888888;
    font-size: 12px;
    font-family: 'DM Sans', Arial, sans-serif;
    border-top: 1px solid #f5e7d8;
    margin-top: 24px;
  ">
    <p style="margin: 4px 0; color: #4A7C2F; font-weight: 600;">
      Achaarwaala
    </p>
    <p style="margin: 4px 0;">
      Ward no 11, Udaipurwati, Lohagaal,
    </p>
    <p style="margin: 4px 0;">
      Jhunjhunu, Rajasthan — 333012
    </p>
    <p style="margin: 8px 0 4px 0;">
      © ${new Date().getFullYear()} Achaarwaala. All rights reserved.
    </p>
  </div>
`;

export const emailTemplates = {
  orderConfirmation: (order, user) => ({
    subject: `Order Confirmed #${order.orderNumber} `,
    html: `
      <div style="font-family: 'DM Sans', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #2e211c;">
        <div style="background: #4A7C2F; padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Achaarwaala</h1>
        </div>
        <div style="padding: 40px; background: #fffdfb; border: 1px solid #f5e7d8; border-top: none; border-radius: 0 0 12px 12px;">
          <h2 style="color: #4A7C2F; margin-top: 0;">Hi ${user.name}, your order is confirmed! 🎉</h2>
          <p>We've received your order and are preparing your delicious, handcrafted pickles.</p>
          
          <div style="background: #f7f0e7; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <p style="margin: 5px 0;">Order Number: <strong>#${order.orderNumber}</strong></p>
            <p style="margin: 5px 0;">Total Amount: <strong>₹${order.total}</strong></p>
          </div>
          
          <p>We'll notify you once your order has been shipped.</p>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.CLIENT_URL}/orders/${order.id}" 
               style="background: #4A7C2F; color: white; padding: 14px 28px; text-decoration: none; border-radius: 30px; display: inline-block; font-weight: bold; box-shadow: 0 4px 12px rgba(74, 124, 47, 0.2);">
              Track My Order
            </a>
          </div>
          
          ${SHARED_FOOTER}
        </div>
      </div>
    `,
  }),

  shippingConfirmation: (order, user) => ({
    subject: `Your Achaarwaala Order has been Shipped! `,
    html: `
      <div style="font-family: 'DM Sans', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #2e211c;">
        <div style="background: #4A7C2F; padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Achaarwaala</h1>
        </div>
        <div style="padding: 40px; background: #fffdfb; border: 1px solid #f5e7d8; border-top: none; border-radius: 0 0 12px 12px;">
          <h2 style="color: #4A7C2F; margin-top: 0;">Hi ${user.name}, your order has been shipped! 🚚</h2>
          <p>Great news! Your handcrafted pickles are packed securely and on their way to you.</p>
          
          <div style="background: #f7f0e7; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <p style="margin: 5px 0;">Order Number: <strong>#${order.orderNumber}</strong></p>
            <p style="margin: 5px 0;">Tracking Number: <strong>${order.trackingNumber || 'N/A'}</strong></p>
          </div>
          
          <p>You can track your package live directly on our website using the link below:</p>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.CLIENT_URL}/orders/${order.id}" 
               style="background: #4A7C2F; color: white; padding: 14px 28px; text-decoration: none; border-radius: 30px; display: inline-block; font-weight: bold; box-shadow: 0 4px 12px rgba(74, 124, 47, 0.2);">
              Track My Order on Website ↗
            </a>
          </div>
          
          ${SHARED_FOOTER}
        </div>
      </div>
    `,
  }),

  welcomeEmail: (user) => ({
    subject: 'Welcome to Achaarwaala! ',
    html: `
      <div style="font-family: 'DM Sans', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #2e211c;">
        <div style="background: #4A7C2F; padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Welcome to Achaarwaala</h1>
        </div>
        <div style="padding: 40px; background: #fffdfb; border: 1px solid #f5e7d8; border-top: none; border-radius: 0 0 12px 12px;">
          <h2 style="color: #4A7C2F; margin-top: 0;">Hi ${user.name}! 🎉</h2>
          <p>Thank you for joining Achaarwaala. We specialize in authentic handcrafted Indian pickles (achaar) straight from Lohagaal, Jhunjhunu, Rajasthan.</p>
          
          <p>Discover our wide collection of 85+ traditional varieties of Raw Mango, Ker, Sangri, Garlic, and Lemon pickles made to capture the true village flavors.</p>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.CLIENT_URL}/products"
               style="background: #4A7C2F; color: white; padding: 14px 28px; text-decoration: none; border-radius: 30px; display: inline-block; font-weight: bold; box-shadow: 0 4px 12px rgba(74, 124, 47, 0.2);">
              Start Shopping
            </a>
          </div>
          
          ${SHARED_FOOTER}
        </div>
      </div>
    `,
  }),

  emailVerification: (user, verificationLink) => ({
    subject: 'Verify Your Email - Achaarwaala',
    html: `
      <div style="font-family: 'DM Sans', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #2e211c;">
        <div style="background: #4A7C2F; padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Verify Your Email</h1>
        </div>
        <div style="padding: 40px; background: #fffdfb; border: 1px solid #f5e7d8; border-top: none; border-radius: 0 0 12px 12px;">
          <h2 style="color: #4A7C2F; margin-top: 0;">Hi ${user.name}! </h2>
          <p>Welcome to Achaarwaala! Please verify your email address to complete your registration.</p>
          
          <div style="text-align: center; margin: 35px 0;">
            <a href="${verificationLink}"
               style="background: #D4A017; color: white; padding: 14px 32px; text-decoration: none; border-radius: 30px; display: inline-block; font-weight: bold; box-shadow: 0 4px 12px rgba(212, 160, 23, 0.2);">
              Verify Email Address
            </a>
          </div>
          
          <p style="color: #7a655c; font-size: 13px; text-align: center;">
            Or copy and paste this link in your browser:<br>
            <code style="word-break: break-all; color: #4A7C2F;">${verificationLink}</code>
          </p>
          
          <p style="color: #7a655c; font-size: 13px; margin-top: 25px;">
            This verification link will expire in 24 hours. If you didn't create this account, please ignore this email.
          </p>
          
          ${SHARED_FOOTER}
        </div>
      </div>
    `,
  }),

  adminNewOrder: (order, user) => ({
    subject: ` New Order Received #${order.orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px;">
        <h2 style="color: #4A7C2F;">New Order Alert! </h2>
        <p>Order Number: <strong>#${order.orderNumber}</strong></p>
        <p>Customer: <strong>${user.name} (${user.email})</strong></p>
        <p>Total Amount: <strong>₹${order.total}</strong></p>
        <p>Check the admin panel for details and fulfillment.</p>
        <div style="margin-top: 20px;">
          <a href="${process.env.ADMIN_URL}/orders/${order.id}" 
             style="background: #D4A017; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
            Manage Order
          </a>
        </div>
      </div>
    `,
  }),

  adminNewServiceRequest: (request, user) => ({
    subject: `🛠️ New Request #${request.orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px;">
        <h2 style="color: #D4A017;">New Request!</h2>
        <p>Request ID: <strong>#${request.orderNumber}</strong></p>
        <p>Service: <strong>${request.serviceType}</strong></p>
        <p>Customer: <strong>${user?.name || 'Guest'} (${user?.email || 'N/A'})</strong></p>
        <p>Est. Price: <strong>${request.priceRange}</strong></p>
        <div style="margin-top: 20px;">
          <a href="${process.env.ADMIN_URL}/service-requests" 
             style="background: #4A7C2F; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
            View Requests
          </a>
        </div>
      </div>
    `,
  }),

  adminTransaction: (order, user, transactionType) => {
    const typeLabel = {
      ORDER_CREATED: ' New Order Created',
      ORDER_PAID: ' Order Payment Received',
      ORDER_SHIPPED: ' Order Shipped',
      ORDER_RETURNED: ' Order Return Initiated',
      ORDER_CANCELLED: ' Order Cancelled',
    }[transactionType] || ' Transaction Update';

    return {
      subject: typeLabel,
      html: `
        <div style="font-family: 'DM Sans', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #2e211c; border: 2px solid #D4A017;">
          <div style="background: linear-gradient(135deg, #4A7C2F 0%, #639c43 100%); padding: 25px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 22px;">${typeLabel}</h1>
          </div>
          <div style="padding: 30px; background: #fffdfb; border-radius: 0 0 8px 8px;">
            <p style="margin: 0 0 20px 0; color: #7a655c; font-size: 14px;"><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
            
            <div style="background: #f7f0e7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #D4A017;">
              <p style="margin: 8px 0;"><strong style="color: #4A7C2F;">Order Details:</strong></p>
              <p style="margin: 5px 0;"> <strong>Order ID:</strong> #${order.orderNumber || order.id}</p>
              <p style="margin: 5px 0;"> <strong>Amount:</strong> ₹${order.total}</p>
              <p style="margin: 5px 0;"> <strong>Customer:</strong> ${user.name} (${user.email})</p>
              <p style="margin: 5px 0;"> <strong>Contact:</strong> ${user.phone || 'N/A'}</p>
              <p style="margin: 5px 0;"> <strong>Items:</strong> ${order.items?.length || 0} item(s)</p>
            </div>
            
            <div style="background: #e8f4f8; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #2196F3;">
              <p style="margin: 0; color: #1565c0; font-size: 13px;"> <strong>Action Required:</strong> Review this transaction in the admin panel</p>
            </div>
            
            <div style="text-align: center; margin-top: 25px;">
              <a href="${process.env.ADMIN_URL}/orders/${order.id}" 
                 style="background: #D4A017; color: white; padding: 12px 28px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; box-shadow: 0 4px 8px rgba(212, 160, 23, 0.2);">
                View in Admin Panel
              </a>
            </div>
            
            <p style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #f5e7d8; text-align: center; color: #7a655c; font-size: 12px;">
              © ${new Date().getFullYear()} Achaarwaala. All rights reserved.
            </p>
          </div>
        </div>
      `,
    };
  },

  passwordReset: (user, resetUrl) => ({
    subject: 'Reset Your Password - Achaarwaala',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #2e211c;">
        <div style="padding: 40px; background: #fffdfb; border: 1px solid #f5e7d8; border-radius: 12px;">
          <h2 style="color: #4A7C2F;">Password Reset Request</h2>
          <p>Hi ${user.name}, we received a request to reset your password. Click the button below to choose a new one.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}"
               style="background: #e63946; color: white; padding: 14px 28px; text-decoration: none; border-radius: 30px; display: inline-block; font-weight: bold;">
               Reset Password
            </a>
          </div>
          <p style="color: #7a655c; font-size: 13px;">This link will expire in 15 minutes. If you didn't request this, you can safely ignore this email.</p>
          ${SHARED_FOOTER}
        </div>
      </div>
    `,
  }),
};
