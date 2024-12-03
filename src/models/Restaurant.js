const mongoose = require('mongoose');
const slugify = require('slugify');
const { uploadFile, deleteFile } = require('../services/storage.service');

const restaurantSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: String,
    imageUrl: String,
    logo: String,
    coverImage: String,
    contact: {
      email: String,
      phone: String,
      address: String,
      coordinates: {
        latitude: Number,
        longitude: Number,
      },
    },
    settings: {
      isActive: {
        type: Boolean,
        default: true,
      },
      acceptingOrders: {
        type: Boolean,
        default: true,
      },
      minimumOrderValue: {
        type: Number,
        default: 0,
      },
      deliveryRadius: Number,
      taxPercentage: Number,
    },
    customization: {
      primaryColor: String,
      secondaryColor: String,
      fontFamily: String,
    },
  },
  {
    timestamps: true,
  }
);

restaurantSchema.pre('save', async function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true });
  }

  try {
    if (this.isModified('image') && this.image?.buffer) {
      const imageUrl = await uploadFile(this.image);
      this.imageUrl = imageUrl;
      this.image = undefined;
    }

    if (this.isModified('logoFile') && this.logoFile?.buffer) {
      const logoUrl = await uploadFile(this.logoFile);
      this.logo = logoUrl;
      this.logoFile = undefined;
    }

    if (this.isModified('coverFile') && this.coverFile?.buffer) {
      const coverUrl = await uploadFile(this.coverFile);
      this.coverImage = coverUrl;
      this.coverFile = undefined;
    }

    next();
  } catch (error) {
    next(error);
  }
});

restaurantSchema.pre('remove', async function (next) {
  try {
    const imagesToDelete = [this.imageUrl, this.logo, this.coverImage].filter(
      Boolean
    );

    for (const imageUrl of imagesToDelete) {
      await deleteFile(imageUrl);
    }
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
