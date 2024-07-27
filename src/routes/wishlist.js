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

wishlistRoute.route("/wishlists").post(userMiddleWare, createMiddleWare, createWishlist);
wishlistRoute.route("/wishlists/:id/add").post(userMiddleWare, addProduct);
wishlistRoute.route("/wishlists/:id/remove").post(userMiddleWare, removeProduct);
wishlistRoute.route("/wishlists/fetch").get(userMiddleWare, getWishlist);
wishlistRoute.route("/wishlists").get(userMiddleWare, get);
wishlistRoute.route("/wishlists/:id").get(userMiddleWare, getSingle);
wishlistRoute.route("/wishlists/:id").put(userMiddleWare, UpdatebyMiddleWare, update);
wishlistRoute.route("/wishlists/:id").patch(userMiddleWare, UpdatebyMiddleWare, update);
wishlistRoute.route("/wishlists/:id").delete(userMiddleWare, remove);


module.exports = wishlistRoute;