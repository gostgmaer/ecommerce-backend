const express = require("express");
var session = require("express-session");
const shippingRoute = express.Router();

const {
  profile,
  updateUser,
  getusers,
  deleteUser,
} = require("../../controller/orders/orders");

shippingRoute.route("/shipping-methods").get();
shippingRoute.route("/payment-methods").get();
shippingRoute.route("/checkout").post();
