const { createHmac } = require('node:crypto');
const { BadRequestError } = require('../utils/errors');
const Order = require('../models/Order');
const logger = require('../utils/logger');

const handleRazorpayWebhook = async (req, res, next) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const shasum = createHmac('sha256', secret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest('hex');

    if (digest === req.headers['x-razorpay-signature']) {
      const event = req.body;

      switch (event.event) {
        case 'payment.captured':
          await handlePaymentCaptured(event.payload.payment.entity);
          break;
        case 'payment.failed':
          await handlePaymentFailed(event.payload.payment.entity);
          break;
      }

      res.json({ status: 'ok' });
    } else {
      throw new BadRequestError('Invalid webhook signature');
    }
  } catch (error) {
    logger.error('Webhook error:', error);
    next(error);
  }
};

const handlePaymentCaptured = async (payment) => {
  const order = await Order.findOne({
    'payment.transactionId': payment.order_id,
  });
  if (order) {
    order.payment.status = 'COMPLETED';
    order.payment.details = payment;
    await order.save();
    logger.info(`Payment completed for order: ${order._id}`);
  }
};

const handlePaymentFailed = async (payment) => {
  const order = await Order.findOne({
    'payment.transactionId': payment.order_id,
  });
  if (order) {
    order.payment.status = 'FAILED';
    order.status = 'CANCELLED';
    order.payment.details = payment;
    await order.save();
    logger.info(`Payment failed for order: ${order._id}`);
  }
};

module.exports = {
  handleRazorpayWebhook,
};
