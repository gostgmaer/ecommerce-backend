const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product', // Reference to the Product model
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  // Embedded product details
  productName: String,
  productImage: String,
  productPrice: Number,
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  items: [orderItemSchema], // Array of ordered items
  total: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'shipped', 'delivered'],
    default: 'pending',
  },
  // Other order-related fields if needed, e.g., shipping address, payment information, etc.
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
