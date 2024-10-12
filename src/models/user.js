const mongoose = require("mongoose");

const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true, minlength: 3, maxlength: 30 },
    socialID: { type: String, default: null },
    email: { type: String, required: true, unique: true, lowercase: true },
    hash_password: { type: String, required: false },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    dateOfBirth: { type: Date, default: null },
    gender: { type: String, enum: ["Male", "Female", "Other"], default: null },
    phoneNumber: { type: String, default: null, match: /^[0-9]{10}$/ },
    address: [{ type: mongoose.Schema.Types.ObjectId, ref: "Address" }],
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
    favoriteProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    profilePicture: { type: String, default: null },
    resetToken: { type: String, default: null },
    resetTokenExpiration: { type: Date, default: null },
    session: [{ type: Object }],
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updated_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    created_user_id: { type: String, default: null },
    updated_user_id: { type: String, default: null },
    confirmToken: { type: String, default: null },
    role: { type: String, enum: ["user", "admin", "customer"], default: "user" },
    isVerified: { type: Boolean, default: false },
    tokens: [{ token: { type: String } }],
    socialMedia: { facebook: { type: String, default: null }, twitter: { type: String, default: null }, instagram: { type: String, default: null }, linkedin: { type: String, default: null }, google: { type: String, default: null }, pinterest: { type: String, default: null } },
    preferences: { newsletter: { type: Boolean, default: false }, notifications: { type: Boolean, default: true }, language: { type: String, default: "en" }, currency: { type: String, default: "USD" }, theme: { type: String, enum: ["light", "dark"], default: "light" } },
    interests: { type: [String], default: [] },
    lastLogin: { type: Date, default: null },
    loyaltyPoints: { type: Number, default: 0 },
    referralCode: { type: String, unique: true },
    referredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    shoppingCart: { items: [{ product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true }, quantity: { type: Number, required: true, min: 1, default: 1 } }], total: { type: Number, default: 0 } },
    wishList: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    paymentMethods: [{ method: { type: String, enum: ["credit_card", "paypal", "bank_transfer"], required: true }, details: { cardNumber: { type: String, default: null }, expiryDate: { type: Date, default: null }, holderName: { type: String, default: null } }, isDefault: { type: Boolean, default: false } }],
    shippingPreferences: { deliveryMethod: { type: String, enum: ["standard", "express"], default: "standard" }, deliveryInstructions: { type: String, default: null }, preferredTime: { type: String, default: null } },
    subscriptionStatus: { type: String, enum: ["active", "inactive"], default: "inactive" },
    subscriptionType: { type: String, enum: ["free", "premium", "enterprise"], default: "free" }
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
