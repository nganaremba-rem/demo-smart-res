const mongoose = require('mongoose');
const slugify = require('slugify');
const { uploadFile, deleteFile } = require('../services/storage.service');

const customizationOptionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  maxQuantity: {
    type: Number,
    default: 1,
  },
});

const customizationGroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  options: [customizationOptionSchema],
  required: {
    type: Boolean,
    default: false,
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  minSelect: {
    type: Number,
    default: 0,
  },
  maxSelect: {
    type: Number,
    default: 1,
  },
});

const productSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      short: String,
      long: String,
    },
    images: [
      {
        url: String,
        alt: String,
        isPrimary: Boolean,
      },
    ],
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    discountedPrice: {
      type: Number,
      min: 0,
    },
    customization: [customizationGroupSchema],
    attributes: {
      isVeg: {
        type: Boolean,
        required: true,
      },
      spiceLevel: {
        type: String,
        enum: ['MILD', 'MEDIUM', 'HOT', 'EXTRA_HOT'],
      },
      allergens: [
        {
          type: String,
          enum: [
            'DAIRY',
            'EGGS',
            'FISH',
            'SHELLFISH',
            'TREE_NUTS',
            'PEANUTS',
            'WHEAT',
            'SOY',
          ],
        },
      ],
      calories: Number,
      preparationTime: Number, // in minutes
    },
    availability: {
      isAvailable: {
        type: Boolean,
        default: true,
      },
      stockCount: Number,
      startTime: String,
      endTime: String,
      days: [
        {
          type: String,
          enum: [
            'MONDAY',
            'TUESDAY',
            'WEDNESDAY',
            'THURSDAY',
            'FRIDAY',
            'SATURDAY',
            'SUNDAY',
          ],
        },
      ],
    },
    metadata: {
      totalOrders: {
        type: Number,
        default: 0,
      },
      averageRating: {
        type: Number,
        default: 0,
      },
      reviewCount: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Create compound index for restaurant and slug
productSchema.index({ restaurantId: 1, slug: 1 }, { unique: true });
productSchema.index({ restaurantId: 1, categoryId: 1 });
productSchema.index({
  name: 'text',
  'description.short': 'text',
  'description.long': 'text',
});

// Generate slug before saving
productSchema.pre('save', async function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true });
  }

  try {
    // Handle multiple images
    if (this.isModified('images') && Array.isArray(this.images)) {
      const uploadPromises = this.images
        .filter((img) => img.buffer) // Only process new images with buffers
        .map(async (img) => {
          const url = await uploadFile(img);
          return {
            url,
            alt: img.alt || this.name,
            isPrimary: img.isPrimary || false,
          };
        });

      const uploadedImages = await Promise.all(uploadPromises);

      // Combine with existing images that don't have buffers (already uploaded)
      this.images = [
        ...this.images.filter((img) => !img.buffer),
        ...uploadedImages,
      ];
    }
    next();
  } catch (error) {
    next(error);
  }
});

// Method to check if product is available at given time
productSchema.methods.isAvailableAt = function (dateTime) {
  if (!this.availability.isAvailable) return false;
  if (
    this.availability.stockCount !== undefined &&
    this.availability.stockCount <= 0
  )
    return false;

  const day = dateTime.toUpperCase();
  if (!this.availability.days.includes(day)) return false;

  if (this.availability.startTime && this.availability.endTime) {
    const currentTime = dateTime.getHours() * 100 + dateTime.getMinutes();
    const startTime = Number.parseInt(
      this.availability.startTime.replace(':', '')
    );
    const endTime = Number.parseInt(this.availability.endTime.replace(':', ''));

    return currentTime >= startTime && currentTime <= endTime;
  }

  return true;
};

// Add pre-remove middleware to clean up Cloudinary images
productSchema.pre('remove', async function (next) {
  try {
    const deletePromises = this.images
      .map((img) => img.url)
      .filter(Boolean)
      .map((url) => deleteFile(url));

    await Promise.all(deletePromises);
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('Product', productSchema);
