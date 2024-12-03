const Razorpay = require('razorpay');
const { createHmac } = require('node:crypto');
const { BadRequestError } = require('../utils/errors');
const logger = require('../utils/logger');

// At the top of the file
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  logger.error('Razorpay credentials are missing');
  throw new Error('Payment service configuration is incomplete');
}

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const processPayment = async (paymentDetails) => {
  try {
    const { amount, currency, paymentMethod } = paymentDetails;

    switch (paymentMethod) {
      case 'RAZORPAY':
        return await processRazorpayPayment(paymentDetails);

      case 'UPI':
        return await processUPIPayment(paymentDetails);

      case 'WALLET':
        return await processWalletPayment(paymentDetails);

      case 'CASH':
        return {
          status: 'PENDING',
          transactionId: `COD-${Date.now()}`,
        };

      default:
        throw new BadRequestError('Invalid payment method');
    }
  } catch (error) {
    logger.error('Payment processing error:', error);
    throw new BadRequestError('Payment processing failed');
  }
};

const processRazorpayPayment = async ({
  amount,
  currency = 'INR',
  orderId,
  notes = {},
}) => {
  try {
    const options = {
      amount: Math.round(amount * 100), // Convert to paise
      currency,
      receipt: orderId,
      notes: {
        orderId,
        ...notes,
      },
    };

    const order = await razorpay.orders.create(options);

    return {
      status: 'PENDING',
      transactionId: order.id,
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
      },
    };
  } catch (error) {
    logger.error('Razorpay order creation error:', error);
    throw new BadRequestError('Payment initialization failed');
  }
};

const verifyPayment = async (paymentDetails) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      paymentDetails;

    // Verify signature using template literal
    const sign = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSign = createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest('hex');

    if (expectedSign !== razorpay_signature) {
      throw new BadRequestError('Invalid payment signature');
    }

    // Fetch payment details
    const payment = await razorpay.payments.fetch(razorpay_payment_id);

    if (payment.status !== 'captured') {
      throw new BadRequestError('Payment not captured');
    }

    return {
      status: 'COMPLETED',
      transactionId: razorpay_payment_id,
      data: payment,
    };
  } catch (error) {
    logger.error('Payment verification error:', error);
    throw new BadRequestError('Payment verification failed');
  }
};

const processRefund = async (paymentId, amount, notes = {}) => {
  try {
    const refund = await razorpay.payments.refund(paymentId, {
      amount: Math.round(amount * 100), // Convert to paise
      notes,
    });

    return {
      status: 'COMPLETED',
      transactionId: refund.id,
      data: refund,
    };
  } catch (error) {
    logger.error('Refund processing error:', error);
    throw new BadRequestError('Refund processing failed');
  }
};

const getPaymentDetails = async (paymentId) => {
  try {
    const payment = await razorpay.payments.fetch(paymentId);
    return payment;
  } catch (error) {
    logger.error('Payment fetch error:', error);
    throw new BadRequestError('Could not fetch payment details');
  }
};

const getRefundDetails = async (refundId) => {
  try {
    const refund = await razorpay.refunds.fetch(refundId);
    return refund;
  } catch (error) {
    logger.error('Refund fetch error:', error);
    throw new BadRequestError('Could not fetch refund details');
  }
};

module.exports = {
  processPayment,
  verifyPayment,
  processRefund,
  getPaymentDetails,
  getRefundDetails,
};
