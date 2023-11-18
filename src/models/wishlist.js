const mongoose = require('mongoose');

const wishlistItemSchema = new mongoose.Schema({
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
});

const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  items: [wishlistItemSchema], // Array of cart items
  // Other cart-related fields if needed, e.g., total price, discounts, etc.
}, { timestamps: true });

const wishList = mongoose.model('wishlist', wishlistSchema);

module.exports = wishList;
