const express = require("express");
var session = require("express-session");
const cartRoute = express.Router();
const UpdatebyMiddleWare = require("../middleware/updatedBy");
const createMiddleWare = require("../middleware/createMiddleWare");
const userMiddleWare = require("../middleware/userAccess");
const adminMiddleware = require("../middleware/adminAccess");

const {
  createCart,
  getCarts,
  getSingleCarts,
  updateCart,updateSingleCart,
  deleteCarts,
} = require("../controller/cart/cart");

cartRoute.route("/cart").post(createMiddleWare,createCart);
cartRoute.route("/cart/:id/add").post(updateSingleCart);
cartRoute.route("/cart/:id/remove").post(updateSingleCart);
cartRoute.route("/cart/:id/checkout").post();
cartRoute.route("/cart").get(getCarts);
cartRoute.route("/cart/:id").get(getSingleCarts);
cartRoute.route("/cart/:id").put(updateCart);
cartRoute.route("/cart/:id").patch(updateCart);
cartRoute.route("/cart/:id").delete(deleteCarts);


module.exports = cartRoute;