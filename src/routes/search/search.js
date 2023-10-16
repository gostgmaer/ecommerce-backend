const express = require("express");
var session = require("express-session");
const searchRoute = express.Router();

const {
  profile,
  updateUser,
  getusers,
  deleteUser,
} = require("../../controller/orders/orders");

searchRoute.route("/search").get();

