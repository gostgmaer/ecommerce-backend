const express = require("express");
var session = require("express-session");
const orderRoute = express.Router();

const {
  profile,
  updateUser,
  getusers,
  deleteUser,
} = require("../../controller/orders/orders");

orderRoute.route("/orders").post();
orderRoute.route("/orders").get();
orderRoute.route("/orders/:id").get();
orderRoute.route("/orders/:id").put();
orderRoute.route("/orders/:id").patch();
orderRoute.route("/orders/:id").delete();
