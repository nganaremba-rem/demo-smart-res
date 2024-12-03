const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const addressSchema = new mongoose.Schema({
  type: String,
  address: String,
  landmark: String,
  coordinates: {
    latitude: Number,
    longitude: Number,
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
});

const userSchema = new mongoose.Schema(
  {
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
    },
    addresses: [addressSchema],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  if (this.isModified('phoneNumber')) {
    // Add phone number verification logic here
  }
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  // Since we're using phone number authentication, this is a placeholder
  // that always returns true. In a real password-based system,
  // you would compare hashed passwords here
  return true;
};

module.exports = mongoose.model('User', userSchema);
