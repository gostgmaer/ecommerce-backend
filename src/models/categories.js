const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
    },
    child: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    }],
    status: {
      type: String,
      default: "pending",
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
    images: [],

    descriptions: String,
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updated_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

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
