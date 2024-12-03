const mongoose = require('mongoose');

const orderItemCustomizationSchema = new mongoose.Schema({
  name: String,
  option: String,
  price: Number,
});

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
  },
  customizations: [orderItemCustomizationSchema],
  subtotal: {
    type: Number,
    required: true,
  },
});

const orderSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    items: [orderItemSchema],
    status: {
      type: String,
      enum: [
        'PENDING',
        'CONFIRMED',
        'PREPARING',
        'READY',
        'OUT_FOR_DELIVERY',
        'DELIVERED',
        'CANCELLED',
        'REFUNDED',
      ],
      default: 'PENDING',
    },
    statusHistory: [
      {
        status: String,
        timestamp: Date,
        note: String,
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Admin',
        },
      },
    ],
    payment: {
      method: {
        type: String,
        enum: ['RAZORPAY', 'UPI', 'WALLET', 'CASH'],
        required: true,
      },
      status: {
        type: String,
        enum: ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'],
        default: 'PENDING',
      },
      transactionId: String,
      amount: {
        type: Number,
        required: true,
      },
      details: {
        type: Object,
      },
    },
    delivery: {
      address: {
        type: {
          type: String,
          required: true,
        },
        address: {
          type: String,
          required: true,
        },
        coordinates: {
          latitude: Number,
          longitude: Number,
        },
      },
      instructions: String,
      assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DeliveryPartner',
      },
      estimatedTime: Date,
      actualDeliveryTime: Date,
    },
    pricing: {
      subtotal: {
        type: Number,
        required: true,
      },
      tax: {
        type: Number,
        required: true,
      },
      deliveryFee: {
        type: Number,
        required: true,
      },
      discount: {
        type: Number,
        default: 0,
      },
      total: {
        type: Number,
        required: true,
      },
    },
    appliedCoupon: {
      code: String,
      discount: Number,
    },
    rating: {
      food: {
        type: Number,
        min: 1,
        max: 5,
      },
      delivery: {
        type: Number,
        min: 1,
        max: 5,
      },
      comment: String,
      createdAt: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
orderSchema.index({ restaurantId: 1, orderNumber: 1 });
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });

// Generate order number
orderSchema.pre('save', async function (next) {
  if (this.isNew) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const count = await this.constructor.countDocuments({
      restaurantId: this.restaurantId,
      createdAt: {
        $gte: new Date(date.getFullYear(), date.getMonth(), 1),
        $lt: new Date(date.getFullYear(), date.getMonth() + 1, 1),
      },
    });

    this.orderNumber = `${year}${month}-${this.restaurantId
      .toString()
      .slice(-4)}-${(count + 1).toString().padStart(4, '0')}`;
  }
  next();
});

// Add status history
orderSchema.pre('save', function (next) {
  if (this.isModified('status')) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date(),
      note: 'Status updated',
    });
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
