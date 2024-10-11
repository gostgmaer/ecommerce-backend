const mongoose = require("mongoose");

const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true, // Removes whitespace
      minlength: 3, // Minimum length for username
      maxlength: 30, // Maximum length for username
    },
    socialID: {
      type: String,
      default: null, // Optional social ID for social login
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true, // Converts to lowercase
    },
    hash_password: {
      type: String,
      required: false,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
      default: null, // Optional date of birth
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      default: null, // Optional gender
    },
    phoneNumber: {
      type: String,
      default: null,
      match: /^[0-9]{10}$/, // Regex to validate phone number format (10 digits)
    },
    address: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
      },
    ],
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order", // Reference to the Order model
      },
    ],
    favoriteProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product", // Reference to the Product model
      },
    ],
    profilePicture: {
      type: String,
      default: null, // URL to the profile picture
    },
    resetToken: {
      type: String,
      default: null, // Token for password reset
    },
    resetTokenExpiration: {
      type: Date,
      default: null, // Expiration date for the reset token
    },
    session: [
      {
        type: Object, // Store session data (could be enhanced with details)
      },
    ],
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the user who created this account
    },
    updated_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the user who last updated this account
    },
    created_user_id: {
      type: String,
      default: null, // ID of the user who created this account
    },
    updated_user_id: {
      type: String,
      default: null, // ID of the user who last updated this account
    },
    confirmToken: {
      type: String,
      default: null, // Token for email confirmation
    },
    role: {
      type: String,
      enum: ["user", "admin", "customer"],
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false, // Indicates if the user's email is verified
    },
    tokens: [
      {
        token: {
          type: String,
        },
      },
    ],
    socialMedia: {
      facebook: {
        type: String,
        default: null, // Facebook profile URL
      },
      twitter: {
        type: String,
        default: null, // Twitter profile URL
      },
      instagram: {
        type: String,
        default: null, // Instagram profile URL
      },
      linkedin: {
        type: String,
        default: null, // LinkedIn profile URL
      },
      google: {
        type: String,
        default: null, // Google profile URL
      },
      pinterest: {
        type: String,
        default: null, // Pinterest profile URL
      },
    },
    preferences: {
      newsletter: {
        type: Boolean,
        default: false, // Indicates if the user wants to receive newsletters
      },
      notifications: {
        type: Boolean,
        default: true, // Indicates if the user wants to receive notifications
      },
      language: {
        type: String,
        default: "en", // User's preferred language
      },
      currency: {
        type: String,
        default: "USD", // User's preferred currency
      },
      theme: {
        type: String,
        enum: ["light", "dark"],
        default: "light", // User's theme preference
      },
    },
    interests: {
      type: [String],
      default: [], // Array to store user interests
    },
    lastLogin: {
      type: Date,
      default: null, // Date of last login
    },
    createdAt: {
      type: Date,
      default: Date.now, // Automatically set the creation date
    },
    updatedAt: {
      type: Date,
      default: Date.now, // Automatically set the last update date
    },
    loyaltyPoints: {
      type: Number,
      default: 0, // User's loyalty points for rewards
    },
    referralCode: {
      type: String,
      unique: true, // Unique referral code for the user
    },
    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the user who referred them
    },
    shoppingCart: {
      items: [
        {
          product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product", // Reference to the Product model
            required: true,
          },
          quantity: {
            type: Number,
            required: true,
            min: 1,
            default: 1, // Default quantity for the product in the cart
          },
        },
      ],
      total: {
        type: Number,
        default: 0, // Total cost of items in the cart
      },
    },
    wishList: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product", // Reference to the Product model
      },
    ],
    paymentMethods: [
      {
        method: {
          type: String,
          enum: ["credit_card", "paypal", "bank_transfer"],
          required: true,
        },
        details: {
          cardNumber: {
            type: String,
            default: null, // Store card number if needed
          },
          expiryDate: {
            type: Date,
            default: null, // Store card expiry date
          },
          holderName: {
            type: String,
            default: null, // Name on the card
          },
        },
        isDefault: {
          type: Boolean,
          default: false, // Indicates if this is the default payment method
        },
      },
    ],
    shippingPreferences: {
      deliveryMethod: {
        type: String,
        enum: ["standard", "express"],
        default: "standard", // User's preferred delivery method
      },
      deliveryInstructions: {
        type: String,
        default: null, // Instructions for delivery (if any)
      },
      preferredTime: {
        type: String,
        default: null, // Preferred delivery time
      },
    },
    subscriptionStatus: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive", // Status of the user's subscription
    },
    subscriptionType: {
      type: String,
      enum: ["free", "premium", "enterprise"],
      default: "free", // Type of subscription the user has
    },
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
