const express = require("express");
var session = require("express-session");
const wishlistRoute = express.Router();
const UpdatebyMiddleWare = require("../middleware/updatedBy");
const createMiddleWare = require("../middleware/createMiddleWare");
const userMiddleWare = require("../middleware/userAccess");
const adminMiddleware = require("../middleware/adminAccess");

const {
  createWishlist,
  getWishlists,
  getSingleWishlists,
  updateWishlist,
  deleteWishlists,
} = require("../controller/wishlist/wishlist");

wishlistRoute.route("/wishlist/:user_id").post(userMiddleWare,createMiddleWare,createWishlist);
wishlistRoute.route("/wishlist/:id/add").post(userMiddleWare,updateWishlist);
wishlistRoute.route("/wishlist/:id/remove").post(userMiddleWare,deleteWishlists);
wishlistRoute.route("/wishlist/:user_id").get(userMiddleWare,getWishlists);
wishlistRoute.route("/wishlist/:user_id/:id").get(userMiddleWare,getSingleWishlists);
wishlistRoute.route("/wishlist").get(deleteWishlists);
wishlistRoute.route("/wishlist/:id").get(getSingleWishlists);
wishlistRoute.route("/wishlist/:id").put(updateWishlist);
wishlistRoute.route("/wishlist/:id").patch(updateWishlist);
wishlistRoute.route("/wishlist/:id").delete(deleteWishlists);


module.exports = wishlistRoute;