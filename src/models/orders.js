const mongoose = require("mongoose");
const OrderCounter = require("./orderId");
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
    // address: [{
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Address",

    // }],
    items: [CartItemSchema],
    total: {
      type: Number,
      required: true,
    },
    currency: {
      type: String
    },
    orderCreatedtime: {
      type: String,
    },
    payer: {},
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
    address:{
      type: String
    },

    phone: {
      type: String,
      required: true
    },
    payment_method: String,
    transsaction_id: {
      type: String
    },
    transactions: {},
    status: {
      type: String,
      enum: ["pending", "cancel", "pending_payment", "confirmed", "shipped", "delivered"],
      default: "pending",
    },
    order_id: {
      type: String,
      unique: true,
    },
    // Other order-related fields if needed, e.g., shipping address, payment information, etc.
  },
  { timestamps: true }
);

orderSchema.pre("save", async function (next) {
  const order = this;

  // Check if order_id already exists, if so, skip
  if (order.order_id) {
    return next();
  }

  try {
    // Find the current counter value and increment it
    let counter = await OrderCounter.findOneAndUpdate(
      { prefix: "ECO" }, // Find by prefix
      { $inc: { counter: 1 } }, // Increment the counter
      { new: true, upsert: true } // Create a new document if it doesn't exist
    );

    // Generate the order_id in the format "ECO1234567"
    order.order_id = `${counter.prefix}${counter.counter}`;

    next();
  } catch (error) {
    next(error);
  }
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
