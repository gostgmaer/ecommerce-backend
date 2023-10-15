const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category', // Reference to the Category model
  },
  stock: {
    type: Number,
    default: 0,
  },
  imageUrls: [String],
  brand: String, // Brand of the product
  ratings: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true,
      },
      rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true,
      },
    },
  ],
  totalRating: {
    type: Number,
    default: 0,
  },
  // Other product-related fields if needed, e.g., dimensions, weight, etc.
}, { timestamps: true });

productSchema.pre('save', async function (next) {
  try {
    // Calculate the totalRating based on the average of all ratings
    const totalRatings = this.ratings.reduce((acc, rating) => acc + rating.rating, 0);
    this.totalRating = this.ratings.length > 0 ? totalRatings / this.ratings.length : 0;
    next();
  } catch (error) {
    next(error);
  }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
