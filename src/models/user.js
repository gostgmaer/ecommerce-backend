const mongoose = require("mongoose");

const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    socialID: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    hash_password: {
      type: String,
      required: false,
    },
    firstName: String,
    lastName: String,
    dateOfBirth: Date,
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    phoneNumber: String,
    address: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
    }],
    orders: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order", // Reference to the Product model
    }],
    favriteProduct: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product", // Reference to the Product model
    }],

    profilePicture: String,
    resetToken: String,
    resetTokenExpiration: Date,
    session: [{}],
    created_by: String,
    updated_by: String,
    created_user_id: String,
    updated_user_id: String,
    confirmToken: String,
    // URL to a profile picture
    role: {
      type: String,
      enum: ["user", "admin", "customer"],
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    tokens: [
      {
        token: {
          type: String
        },
      },
    ],
    // Add more fields as needed, such as social media profiles, interests, etc.
  },
  { timestamps: true }
);

userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});
userSchema.method({
  async authenticate(password) {
    return bcrypt.compare(password, this.hash_password);
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
