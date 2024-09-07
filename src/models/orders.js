const mongoose = require("mongoose");

// const orderItemSchema = new mongoose.Schema({
//   product: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Product", // Reference to the Product model
//     required: true,
//   },
//   quantity: {
//     type: Number,
//     required: true,
//     min: 1,
//   },
// });
const CartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product', // Reference to the Product model
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  }
}, { _id: false });

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    additionalNotes: String,
    couponcode: String,
    // address: {
    //   billing: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Address", 
    //     required: true,
    //   },
    //   shipping: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Address", 
    //     required: true,
    //   },
    // },
    items: [CartItemSchema],
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
   
    address: {
      type: String,
      required: true
    },
  
    city: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    couponCode: {
      type: String,
      default: ''
    },
    created_by: {
      type: String,
      required: true
    },
    created_user_id: {
      type: mongoose.Types.ObjectId,
      required: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true
    },
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
 
    invoice: {
      type: String,
      unique: true,
     
    },
 
    phone: {
      type: String,
      required: true
    },
    payment_method: String,
    transsaction_id: {
      type: String
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
