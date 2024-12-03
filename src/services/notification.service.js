const admin = require('firebase-admin');
const { createTransport } = require('nodemailer');
const logger = require('../utils/logger');

const serviceAccount = require('../../smart-res-27bd3-firebase-adminsdk-xa697-9c70169a6b.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Initialize Nodemailer
const transporter = createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendOrderNotification = async (order, recipientType) => {
  try {
    switch (recipientType) {
      case 'CUSTOMER':
        await sendCustomerNotification(order);
        break;
      case 'RESTAURANT':
        await sendRestaurantNotification(order);
        break;
      case 'DELIVERY_PARTNER':
        await sendDeliveryPartnerNotification(order);
        break;
    }
  } catch (error) {
    logger.error('Notification error:', error);
    // Don't throw error as notification failure shouldn't affect the main flow
  }
};

const sendCustomerNotification = async (order) => {
  const { user } = order;

  // Send push notification
  if (user.fcmToken) {
    await admin.messaging().send({
      token: user.fcmToken,
      notification: {
        title: `Order ${order.status}`,
        body: getOrderStatusMessage(order.status),
      },
      data: {
        orderId: order._id.toString(),
        type: 'ORDER_UPDATE',
      },
    });
  }

  // Send email
  if (user.email) {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: user.email,
      subject: `Order ${order.status} - ${order.orderNumber}`,
      html: getOrderEmailTemplate(order),
    });
  }
};

const sendRestaurantNotification = async (order) => {
  const { restaurant } = order;

  // Send push notification to restaurant app
  if (restaurant.fcmToken) {
    await admin.messaging().send({
      token: restaurant.fcmToken,
      notification: {
        title: 'New Order Received',
        body: `Order #${order.orderNumber} - ${order.items.length} items`,
      },
      data: {
        orderId: order._id.toString(),
        type: 'NEW_ORDER',
      },
    });
  }

  // Send email to restaurant
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: restaurant.contact.email,
    subject: `New Order - ${order.orderNumber}`,
    html: getRestaurantOrderTemplate(order),
  });
};

const getOrderStatusMessage = (status) => {
  const messages = {
    CONFIRMED: 'Your order has been confirmed',
    PREPARING: 'Restaurant is preparing your order',
    READY: 'Your order is ready',
    OUT_FOR_DELIVERY: 'Your order is out for delivery',
    DELIVERED: 'Your order has been delivered',
    CANCELLED: 'Your order has been cancelled',
  };
  return messages[status] || 'Order status updated';
};

const getOrderEmailTemplate = (order) => {
  // Implement your email template
  return `
    <h1>Order ${order.status}</h1>
    <p>Order Number: ${order.orderNumber}</p>
    <!-- Add more order details -->
  `;
};

const getRestaurantOrderTemplate = (order) => {
  // Implement your email template
  return `
    <h1>New Order Received</h1>
    <p>Order Number: ${order.orderNumber}</p>
    <!-- Add more order details -->
  `;
};

module.exports = {
  sendOrderNotification,
};
