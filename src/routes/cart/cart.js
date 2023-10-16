const express = require("express");
var session = require("express-session");
const cartRoute = express.Router();

const {
  profile,
  updateUser,
  getusers,
  deleteUser,
} = require("../../controller/cart/cart");

cartRoute.route("/cart").post();
cartRoute.route("/cart/:id/add").post();
cartRoute.route("/cart/:id/remove").post();
cartRoute.route("/cart/:id/checkout").post();
cartRoute.route("/cart").get();
cartRoute.route("/cart/:id").get();
cartRoute.route("/cart/:id").put();
cartRoute.route("/cart/:id").patch();
cartRoute.route("/cart/:id").delete();
