const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
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
    parent_category: {
      type: String,
    },
    images: [],
    display_type: {
      type: String,
    },
    descriptions: String,
    // Add more fields as needed for category-related information.
  },
  { timestamps: true }
);

categorySchema.methods.getProductCount = async function (status = "publish") {
  // 'this' refers to the current category document
  const Product = mongoose.model("Product"); // Assuming your product model is named 'Product'

  try {
    const count = await Product.countDocuments({
      categories: this._id,
      status: status,
    });
    return count;
  } catch (error) {
    throw error;
  }
};

categorySchema.methods.getSimplifiedImages = function() {
  if (this.images) {
    return this.images.map(image => ({
      url: image.url,
      name: image.name,
    }));
  }
 
};

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
