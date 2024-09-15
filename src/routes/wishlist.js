const express = require("express");
var session = require("express-session");
const wishlistRoute = express.Router();
const UpdatebyMiddleWare = require("../middleware/updatedBy");
const createMiddleWare = require("../middleware/createMiddleWare");
const userMiddleWare = require("../middleware/userAccess");
const adminMiddleware = require("../middleware/adminAccess");

const {
  get,
  getSingle,
  update,
  remove,
  getWishlist, removeProduct, addProduct, createWishlist
} = require("../controller/wishlist/wishlist");

wishlistRoute.route("/wishlist/add").post(userMiddleWare, createMiddleWare, createWishlist);
wishlistRoute.route("/wishlist/:id/add").post(userMiddleWare, addProduct);
wishlistRoute.route("/wishlist/:id/remove").delete(userMiddleWare, removeProduct);
wishlistRoute.route("/wishlist/fetch").get(userMiddleWare, getWishlist);
wishlistRoute.route("/wishlists").get(userMiddleWare, get);
wishlistRoute.route("/wishlist/:id").get(userMiddleWare, getSingle);
wishlistRoute.route("/wishlist/:id").put(userMiddleWare, UpdatebyMiddleWare, update);
wishlistRoute.route("/wishlist/:id").patch(userMiddleWare, UpdatebyMiddleWare, update);
wishlistRoute.route("/wishlist/:id").delete(userMiddleWare, remove);


module.exports = wishlistRoute;