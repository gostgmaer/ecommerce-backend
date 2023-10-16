const express = require("express");
var session = require("express-session");
const categoryRoute = express.Router();

const {
  profile,
  updateUser,
  getusers,
  deleteUser,
} = require("../../controller/categories/categories");

categoryRoute.route("/categories").post();
categoryRoute.route("/categories").get();
categoryRoute.route("/categories/:id").get();
categoryRoute.route("/categories/:id").put();
categoryRoute.route("/categories/:id").patch();
categoryRoute.route("/categories/:id").delete();
