const express = require("express");
const productRoute = express.Router();
const createMiddleWare = require("../middleware/createMiddleWare");
const userMiddleWare = require("../middleware/userAccess");
const adminMiddleware = require("../middleware/adminAccess");

const {
  createProduct,
  getProducts,
  getSingleProducts,
  updateProduct,
  deleteProducts,getCurrentProducts,getCurrentSingle
} = require("../controller/products/products");

productRoute
  .route("/products")
  .post(adminMiddleware, createMiddleWare, createProduct);
productRoute.route("/products").get(getProducts);
productRoute.route("/products/show").get(getCurrentProducts);
productRoute.route("/products/:id").get(getSingleProducts);
productRoute.route("/products/:slug").get(getCurrentSingle);
// productRoute.route("/products/:id/reviews").get(getproductReviews);
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
