const express = require("express");
const categoryRoute = express.Router();

const {
  createCategory,
  getCategories,
  getSingleCategorys,
  updateCategory,
  deleteCategorys,
  itemsPerCategory,getShowingCategory
} = require("../controller/categories/categories");

categoryRoute.route("/categories").post(createCategory);
categoryRoute.route("/categories").get(getCategories);
categoryRoute.route("/categories/:id").get(getSingleCategorys);
categoryRoute.route("/categories/:id").put(updateCategory);
categoryRoute.route("/categories/:id").patch(updateCategory);
categoryRoute.route("/categories/:id").delete(deleteCategorys);
categoryRoute.route("/categories/data/product-count").get(itemsPerCategory);
categoryRoute.route("/categories/data/show").get(getShowingCategory);

module.exports = categoryRoute;