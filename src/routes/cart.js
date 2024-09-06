const express = require("express");
const cartRoute = express.Router();
const createMiddleWare = require("../middleware/createMiddleWare");

const {
  createCart,
  getCarts,
  getSingleCarts,
  updateCart,updateSingleCart,
  deleteCarts,
} = require("../controller/cart/cart");

cartRoute.route("/cart/add").post(createMiddleWare,createCart);
cartRoute.route("/cart/:id/add").post(updateSingleCart);
cartRoute.route("/cart/:id/remove").post(updateSingleCart);
cartRoute.route("/cart/:id/checkout").post();
cartRoute.route("/cart/:user_id").get(getCarts);
cartRoute.route("/cart/:user_id/:id").get(getSingleCarts);
cartRoute.route("/cart/:id").get(getSingleCarts);
cartRoute.route("/cart").get(getCarts);
cartRoute.route("/cart/:id").put(updateCart);
cartRoute.route("/cart/:id").patch(updateCart);
cartRoute.route("/cart/:id").delete(deleteCarts);


module.exports = cartRoute;