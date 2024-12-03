const Joi = require('joi');

const registerSchema = Joi.object({
  phoneNumber: Joi.string().required(),
  name: Joi.string().required(),
  email: Joi.string().email().optional(),
});

const loginSchema = Joi.object({
  phoneNumber: Joi.string().required(),
});

const restaurantSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string(),
  contact: Joi.object({
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    address: Joi.string().required(),
    coordinates: Joi.object({
      latitude: Joi.number().required(),
      longitude: Joi.number().required(),
    }),
  }).required(),
  settings: Joi.object({
    minimumOrderValue: Joi.number().min(0),
    deliveryRadius: Joi.number().min(0),
    taxPercentage: Joi.number().min(0),
  }),
});

const orderSchema = Joi.object({
  restaurantId: Joi.string().required(),
  items: Joi.array()
    .items(
      Joi.object({
        productId: Joi.string().required(),
        quantity: Joi.number().integer().min(1).required(),
        customizations: Joi.array().items(
          Joi.object({
            name: Joi.string().required(),
            option: Joi.string().required(),
          })
        ),
      })
    )
    .min(1)
    .required(),
  delivery: Joi.object({
    address: Joi.object({
      type: Joi.string().required(),
      address: Joi.string().required(),
      coordinates: Joi.object({
        latitude: Joi.number(),
        longitude: Joi.number(),
      }),
    }).required(),
    instructions: Joi.string(),
  }).required(),
  payment: Joi.object({
    method: Joi.string().valid('RAZORPAY', 'UPI', 'WALLET', 'CASH').required(),
    details: Joi.object(),
  }).required(),
});

const paymentVerificationSchema = Joi.object({
  orderId: Joi.string().required(),
  paymentDetails: Joi.object({
    razorpay_order_id: Joi.string().required(),
    razorpay_payment_id: Joi.string().required(),
    razorpay_signature: Joi.string().required(),
  }).required(),
});

module.exports = {
  registerSchema,
  loginSchema,
  restaurantSchema,
  orderSchema,
  paymentVerificationSchema,
};
