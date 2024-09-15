const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product', // Reference to the Product model
    required: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  images:[],
  title: String,
  review: String,
}, { timestamps: true });

reviewSchema.methods.getSimplifiedImages = function() {
  return this.images.map(image => ({
    url: image.url,
    name: image.name,
  }));
};
const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
