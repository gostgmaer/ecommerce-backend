const express = require("express");
var session = require("express-session");
const productRoute = express.Router();
const UpdatebyMiddleWare = require("../../middleware/updatedBy");
const createMiddleWare = require("../../middleware/createMiddleWare");
const userMiddleWare = require("../../middleware/userAccess");
const adminMiddleware = require("../../middleware/adminAccess");

const {
  createProduct,
  getProducts,
  getSingleProducts,
  updateProduct,
  deleteProducts,
  getproductReviews,
} = require("../../controller/products/products");

productRoute
  .route("/products")
  .post(adminMiddleware, createMiddleWare, createProduct);
productRoute.route("/products").get(getProducts);
productRoute.route("/products/:id").get(getSingleProducts);
productRoute.route("/products/:id/reviews").get(getproductReviews);
productRoute
  .route("/products/:id")
  .patch(adminMiddleware, userMiddleWare, updateProduct);
productRoute
  .route("/products/:id")
  .put(adminMiddleware, userMiddleWare, updateProduct);
productRoute
  .route("/products/:id")
  .delete(adminMiddleware, userMiddleWare, deleteProducts);


  module.exports = productRoute;