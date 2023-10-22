const express = require("express");
var session = require("express-session");
const categoryRoute = express.Router();

const {
  createCategory,
  getCategories,
  getSingleCategorys,
  updateCategory,
  deleteCategorys,
  getCategoryReviews,
} = require("../../controller/categories/categories");

categoryRoute.route("/categories").post(createCategory);
categoryRoute.route("/categories").get(getCategories);
categoryRoute.route("/categories/:id").get(getSingleCategorys);
categoryRoute.route("/categories/:id").put(updateCategory);
categoryRoute.route("/categories/:id").patch(updateCategory);
categoryRoute.route("/categories/:id").delete(deleteCategorys);

module.exports = categoryRoute;