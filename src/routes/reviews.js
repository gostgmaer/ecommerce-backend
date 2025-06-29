const express = require("express");
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
reviewRoute.route("/products/:product_id/reviews").get(adminMiddleware,getAll);
reviewRoute.route("/products/:product_id/reviews/:review_id").get(getSingle);
reviewRoute.route("/products/:product_id/reviews/:review_id").patch(userMiddleWare,updateData);
reviewRoute.route("/products/:product_id/reviews/:review_id").put(userMiddleWare,updateData);
reviewRoute.route("/products/:product_id/reviews/:review_id").delete(userMiddleWare,deleteData);
reviewRoute.route("/reviews/:product_id").post(userMiddleWare,createMiddleWare,create);
reviewRoute.route("/reviews/:product_id").get(adminMiddleware,getAll);
reviewRoute.route("/reviews/:product_id/:review_id").get(getSingle);
reviewRoute.route("/reviews/:product_id/:review_id").patch(userMiddleWare,updateData);
reviewRoute.route("/reviews/:product_id/:review_id").put(userMiddleWare,updateData);
reviewRoute.route("/reviews/:product_id/:review_id").delete(userMiddleWare,deleteData);

module.exports = reviewRoute;