const mongoose = require('mongoose');
const slugify = require('slugify');

const categorySchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    description: String,
    image: {
      url: String,
      key: String, // S3 key
      alt: String,
    },
    parentCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    metadata: {
      productCount: {
        type: Number,
        default: 0,
      },
      averagePrice: Number,
    },
    availability: {
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
  },
  {
    timestamps: true,
  }
);

// Create compound index for restaurant and slug
categorySchema.index({ restaurantId: 1, slug: 1 }, { unique: true });

// Generate slug before saving
categorySchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true });
  }
  next();
});

// Virtual for full category path
categorySchema.virtual('path').get(async function () {
  const path = [this];
  let currentCategory = this;

  while (currentCategory.parentCategoryId) {
    currentCategory = await this.constructor.findById(
      currentCategory.parentCategoryId
    );
    if (currentCategory) {
      path.unshift(currentCategory);
    } else {
      break;
    }
  }

  return path;
});

module.exports = mongoose.model('Category', categorySchema);
