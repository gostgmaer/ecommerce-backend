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
    },
    status: {
      type: String,
      required: true,
      default: "pending",
    },

    images: [],
    display_type: {
      type: String,
    },
    contact: {
      email: String,
      phone: String,
    },
    tagline: String,
    descriptions: String,
    // Add more fields as needed for category-related information.
  },
  { timestamps: true }
);

brandSchema.methods.getProductCount = async function (status = "publish") {
  // 'this' refers to the current category document
  const Product = mongoose.model("Product"); // Assuming your product model is named 'Product'

  try {
    const count = await Product.countDocuments({
      brandName: this._id,
      status: status,
    });
    return count;
  } catch (error) {
    throw error;
  }
};

const Brand = mongoose.model("Brand", brandSchema);

module.exports = Brand;
