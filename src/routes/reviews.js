const express = require("express");
var session = require("express-session");
const reviewRoute = express.Router();

const {
  profile,
  updateUser,
  getusers,
  deleteUser,
} = require("../controller/reviews/reviews");

reviewRoute.route("/products/:product_id/reviews").post();
reviewRoute.route("/products/:product_id/reviews").get();
reviewRoute.route("/products/:product_id/reviews/:review_id").get();
reviewRoute.route("/products/:product_id/reviews/:review_id").patch();
reviewRoute.route("/products/:product_id/reviews/:review_id").put();
reviewRoute.route("/products/:product_id/reviews/:review_id").delete();
