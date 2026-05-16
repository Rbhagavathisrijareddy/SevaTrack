import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['admin', 'worker'],
      required: true,
    },
    workerId: {
      type: String,
      unique: true,
      sparse: true,
    },
    password: {
      type: String,
      required: function() { return this.role === 'worker'; }, // Required only for workers (admins use Google OAuth)
    },
    googleId: {
      type: String,
      sparse: true,
    },
    profilePicture: {
      type: String,
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'suspended'],
      default: 'active',
    },
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Create indexes for faster queries
userSchema.index({ role: 1 });

export const User = mongoose.model('User', userSchema);
