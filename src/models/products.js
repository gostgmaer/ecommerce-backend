const mongoose = require("mongoose");
const Review = require("./reviews");
const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    sku: {
      type: String,
      required: true,
    },
    productType: {
      type: String,
      required: true,
    },
    categories: {
      type: [String],
      required: true,
    },
    descriptions: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    images: {
      type: [Object],
    },
    price: {
      type: Number,
      required: true,
    },
    costPrice: {
      type: Number,
    },
    retailPrice: {
      type: Number,
    },
    salePrice: {
      type: Number,
    },
    trackInventory: {
      type: String,
      enum: ["yes", "no", ""],
      default: "yes",
    },
    currentStockLevel: {
      type: Number,
      required: true,
    },
    lowStockLevel: {
      type: Number,
      required: true,
    },
    gtin: {
      type: String,
    },
    manufacturerPartNumber: {
      type: String,
    },
    brandName: {
      type: String,
    },
    slug: {
      type: String,
    },
    productUPCEAN: {
      type: String,
    },
    seo_info: { type: Object },
    tags: {
      type: [String],
    },
   
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    features: {
      type: [String],
    },
    specifications: {
      type: Map,
      of: String,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// productSchema.virtual("ratingStatistics").get(function () {
//   if (this.ratings && this.ratings.length > 0) {
//     const totalRating = this.ratings.reduce(
//       (total, rating) => total + rating.rating,
//       0
//     );
//     const averageRating = totalRating / this.ratings.length;
//     return {
//       totalRating,
//       averageRating,
//     };
//   } else {
//     return {
//       totalRating: 0,
//       averageRating: 0,
//     };
//   }
// });

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
