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

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
