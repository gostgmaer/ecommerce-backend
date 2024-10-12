// wishlist.js
const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product:
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product', // Reference to the Product model
    required: true
  },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  updated_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

}, { timestamps: true });

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

module.exports = Wishlist;
