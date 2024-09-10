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
    payment_status: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "cancel", "pending_payment", "confirmed", "shipped", "delivered","created"],
      default: "pending",
    },
    order_id: {
      type: String,
      unique: true,
    },
    shippingPrice: {
      type: Number,
      default: 0
    },
    totalPrice: {
      type: Number,
      default: 0
    },
    amount: {
      type: Number,
      default: 0
    },
    amount_due: {
      type: Number,
      default: 0
    },
    amount_paid: {
      type: Number,
      default: 0
    },
    attempts: {
      type: Number,
      default: 0
    },
    created_at: {
      type: Number,
      default: () => Math.floor(Date.now() / 1000)
    },
    entity: {
      type: String,
      default: 'order'
    },
    transaction_id: {
      type: String,
      default: 'order'
    },
    notes: [String],
    offer_id: {
      type: mongoose.Schema.Types.Mixed,
      default: null
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
