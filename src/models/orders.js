const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product", // Reference to the Product model
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },

});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    additionalNotes: String,
    couponcode: String,
    address: {
      billing: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address", 
        required: true,
      },
      shipping: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address", 
        required: true,
      },
    },
    items: [orderItemSchema],
    total: {
      type: Number,
      required: true,
    },
    currency:{
      type:String
    },
    orderCreatedtime:{
      type: String,
    },
    payer:{},
    payment_method: String,
    transsaction_id: {
      type: String,
      required: true,
    },
    transactions:{},
    status: {
      type: String,
      enum: ["pending","cancel","pending_payment" ,"confirmed", "shipped", "delivered"],
      default: "pending",
    },
    // Other order-related fields if needed, e.g., shipping address, payment information, etc.
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
