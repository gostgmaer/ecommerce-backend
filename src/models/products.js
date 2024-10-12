const mongoose = require('mongoose');
const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    sku: {
      type: String,
      required: true,
      unique: true
    },
    productType: {
      type: String,
      required: false,
      enum: ['physical', 'digital', 'service'] // Product type classification
    },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
      }
    ],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    },
    descriptions: {
      type: Object, // Could be expanded to support multiple languages
      required: true
    },
    shortDescription: {
      type: String // A brief description for product listings
    },
    status: {
      type: String,
      required: true,
      enum: ['active', 'inactive', 'draft', 'pending', 'archived'] // Extended status options
    },
    images: {
      type: [Object] // Structure can be defined further for image data (URL, alt text, etc.)
    },
    price: {
      type: Number,
      required: true
    },
    discount: {
      type: Number // Can be a percentage or a fixed amount
    },
    costPrice: {
      type: Number
    },
    retailPrice: {
      type: Number
    },
    salePrice: {
      type: Number
    },
    trackInventory: {
      type: String,
      enum: ['yes', 'no', ''],
      default: 'yes'
    },
    currentStockLevel: {
      type: Number,
      required: true
    },
    lowStockLevel: {
      type: Number,
      required: true
    },
    stock: {
      type: Number,
      required: true
    },
    gtin: {
      type: String,
      unique: true // Ensure uniqueness for global trade item numbers
    },
    manufacturerPartNumber: {
      type: String
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Brand',
      required: false
    },
    overview: {
      type: String
    },
    total_view: {
      type: Number,
      default: 0 // Default to zero
    },
    slug: {
      type: String,
      unique: true
    },
    productUPCEAN: {
      type: String,
      unique: true // Ensure uniqueness for UPC/EAN numbers
    },
    seo_info: {
      type: Object // Could hold fields for SEO optimization
    },
    tags: {
      type: [String]
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
      }
    ],
    features: {
      type: [String]
    },
    specifications: {
      type: Map,
      of: String // For technical specifications
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    isAvailable: {
      type: Boolean,
      default: true
    },
    metaTitle: {
      type: String // For SEO
    },
    metaDescription: {
      type: String // For SEO
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User' // Reference to the user who created the product
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User' // Reference to the user who last updated the product
    },
    returnPolicy: {
      type: String // Information about return policy
    },
    warranty: {
      type: String // Warranty information
    },
    shippingDetails: {
      type: String // Shipping information
    },
    additionalImages: {
      type: [String] // Array for storing additional image URLs
    },
    customAttributes: {
      type: Map,
      of: String // For any additional custom attributes
    },
    videoLinks: {
      type: [String] // For product demonstration or promotional videos
    },
    availability: {
      type: String, // Availability status like 'In Stock', 'Out of Stock', etc.
      default: 'In Stock'
    },
    ecoFriendly: {
      type: Boolean, // Indicate if the product is eco-friendly
      default: false
    },
    ageRestriction: {
      type: String // Age restriction if applicable
    },
    dimensions: {
      type: String // Dimensions for shipping and handling
    },
    weight: {
      type: Number // Weight for shipping calculations
    },
    shippingWeight: {
      type: Number // Weight including packaging
    },
    discountStartDate: {
      type: Date // Start date for discounts
    },
    discountEndDate: {
      type: Date // End date for discounts
    },
    relatedProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product' // Reference to related products
      }
    ],
    isGiftCard: {
      type: Boolean, // To indicate if the product is a gift card
      default: false
    },
    giftCardValue: {
      type: Number // Value of the gift card, if applicable
    },
    productBundle: {
      type: Boolean, // To indicate if the product is part of a bundle
      default: false
    },
    bundleContents: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product'
        },
        quantity: {
          type: Number,
          default: 1
        }
      }
    ],
    purchaseLimit: {
      type: Number // Limit on how many of this product can be purchased
    },
    bulkDiscounts: [
      {
        quantity: {
          type: Number // Minimum quantity for discount
        },
        discountAmount: {
          type: Number // Discount amount or percentage
        }
      }
    ],
    giftWrappingAvailable: {
      type: Boolean, // Indicate if gift wrapping is available
      default: false
    },
    preOrder: {
      type: Boolean, // Indicate if the product is available for pre-order
      default: false
    },
    preOrderDate: {
      type: Date // Date when pre-order will be available
    },
    isSubscription: {
      type: Boolean, // Indicate if the product is part of a subscription service
      default: false
    },
    subscriptionDetails: {
      type: String // Details about the subscription
    },
    productOrigin: {
      type: String // Country of origin for the product
    },
    allergens: {
      type: [String] // List of allergens if applicable
    },
    returnPeriod: {
      type: Number // Number of days allowed for returns
    },
    customShippingOptions: {
      type: Map,
      of: String // Additional shipping options
    },
    virtualProduct: {
      type: Boolean, // To indicate if the product is a digital/virtual product
      default: false
    },
    digitalDownloadLink: {
      type: String // Link for digital downloads, if applicable
    }
  },
  { timestamps: true }
);

productSchema.virtual('ratingStatistics').get(function () {
  if (this.reviews && this.reviews.length > 0) {
    const totalReviews = this.reviews.length;
    const totalRating = this.reviews.reduce((total, review) => total + review.rating, 0);
    const averageRating = totalRating / totalReviews;
    return {
      totalReviews,
      averageRating
    };
  } else {
    return {
      totalReviews: 0,
      averageRating: 0
    };
  }
});

productSchema.methods.getSimplifiedImages = function () {
  return this.images.map((image) => ({
    url: image.url,
    name: image.name
  }));
};

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
