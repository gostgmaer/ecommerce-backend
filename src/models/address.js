const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  street: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  postalCode: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  name: String, // User's name
  email: String, // User's email
  phone: String, // User's phone number
});

const userAddressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
    shippingAddress: addressSchema, // Shipping address
    billingAddress: addressSchema, // Billing address
    // Other address-related fields if needed, e.g., address type (home, work), etc.
  },
  { timestamps: true }
);

const UserAddress = mongoose.model("Address", userAddressSchema);

module.exports = UserAddress;
