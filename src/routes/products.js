const express = require("express");
const productRoute = express.Router();
const createMiddleWare = require("../middleware/createMiddleWare");
const userMiddleWare = require("../middleware/userAccess");
const adminMiddleware = require("../middleware/adminAccess");

const {
  createProduct,
  getProducts,
  getSingleProducts,
  updateProduct, getRelatedProducts,
  deleteProducts, getCurrentProducts, getCurrentSingle, getDiscountedProducts, getPopularProducts,createProductBulk
} = require("../controller/products/products");

productRoute
  .route("/products")
  .post(adminMiddleware, createMiddleWare, createProduct);
  productRoute.route("/products/bulk")
  .post(adminMiddleware, createMiddleWare, createProductBulk);
productRoute.route("/products").get(getProducts);
productRoute.route("/products/show").get(getCurrentProducts);
productRoute.route("/products/related").get(getRelatedProducts);
productRoute.route("/products/discount").get(getDiscountedProducts);
productRoute.route("/products/popular").get(getPopularProducts);
productRoute.route("/products/:id").get(getSingleProducts);
productRoute.route("/products/view/:slug").get(getCurrentSingle);
productRoute.route("/products/details").get(getCurrentSingle);
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
