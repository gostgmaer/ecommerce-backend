const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true, // Ensure slug is unique
    },
    status: {
      type: String,
      required: true,
      enum: ["active", "inactive", "pending"], // More specific status options
      default: "pending",
    },
    images: [
      {
        url: {
          type: String,
          required: true, // Ensure URL is provided
        },
        altText: {
          type: String,
          default: "", // Alt text for accessibility
        },
        name: {
          type: String,
          default: "", // Image name or description
        },
      },
    ],
    contact: {
      email: {
        type: String,
        default: "", // Email for contact
      },
      phone: {
        type: String,
        default: "", // Phone number for contact
      },
      website: {
        type: String,
        default: "", // Brand website URL
      },
    },
    tagline: {
      type: String,
      default: "", // Tagline for the brand
    },
    descriptions: {
      type: String,
      default: "", // Detailed description of the brand
    },
    seo: {
      metaTitle: {
        type: String,
        default: "", // SEO title for the brand
      },
      metaDescription: {
        type: String,
        default: "", // SEO description for the brand
      },
      keywords: {
        type: [String],
        default: [], // Keywords associated with the brand for SEO
      },
    },
    establishedYear: {
      type: Number,
      default: null, // Year the brand was established
    },
    parentCompany: {
      type: String,
      default: "", // Parent company if applicable
    },
    country: {
      type: String,
      default: "", // Country of origin
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the user who created the brand
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the user who last updated the brand
    },
    socialMedia: {
      facebook: {
        type: String,
        default: "", // Facebook profile or page link
      },
      twitter: {
        type: String,
        default: "", // Twitter profile link
      },
      instagram: {
        type: String,
        default: "", // Instagram profile link
      },
      linkedin: {
        type: String,
        default: "", // LinkedIn page link
      },
    },
    isActive: {
      type: Boolean,
      default: true, // Indicates if the brand is active
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0, // Average rating of the brand
    },
  },
  { timestamps: true }
);

brandSchema.methods.getProductCount = async function (status = "publish") {
  const Product = mongoose.model("Product"); // Assuming your product model is named 'Product'

  // try {
  //   const count = await Product.countDocuments({
  //     brandName: this._id,
  //     status: status,
  //   });
  //   return count;
  // } catch (error) {
  //   throw error;
  // }
  const count = await Product.countDocuments({
    brandName: this._id,
    status: status,
  });
  return count;
};

brandSchema.methods.getSimplifiedImages = function () {
  if (this.images) {
    return this.images.map(image => ({
      url: image.url,
      altText: image.altText,
      name: image.name,
    }));
  }
};

const Brand = mongoose.model("Brand", brandSchema);

module.exports = Brand;
