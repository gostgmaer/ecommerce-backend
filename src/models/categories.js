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
 
    descriptions: String,
   
  },
  { timestamps: true }
);

categorySchema.methods.getProductCount = async function (status = "publish") {
  // 'this' refers to the current category document
  const Product = mongoose.model("Product"); // Assuming your product model is named 'Product'

  const count = await Product.countDocuments({
    categories: this._id,
    status: status,
  });
  return count;
};

categorySchema.methods.getSimplifiedImages = function () {
  if (this.images) {
    return this.images.map(image => ({
      url: image.url,
      name: image.name,
    }));
  }

};

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
