const express = require("express");
var session = require("express-session");
const reviewRoute = express.Router();
const UpdatebyMiddleWare = require("../middleware/updatedBy");
const createMiddleWare = require("../middleware/createMiddleWare");
const userMiddleWare = require("../middleware/userAccess");
const adminMiddleware = require("../middleware/adminAccess");

const {
  create,
  getAll,
  getSingle,
  updateData,
  deleteData,
} = require("../controller/reviews/reviews");

reviewRoute.route("/products/:product_id/reviews").post(userMiddleWare,createMiddleWare,create);
reviewRoute.route("/products/:product_id/reviews").get(getAll);
reviewRoute.route("/products/:product_id/reviews/:review_id").get(getSingle);
reviewRoute.route("/products/:product_id/reviews/:review_id").patch(updateData);
reviewRoute.route("/products/:product_id/reviews/:review_id").put(updateData);
reviewRoute.route("/products/:product_id/reviews/:review_id").delete(deleteData);

module.exports = reviewRoute;