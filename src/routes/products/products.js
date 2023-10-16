const express = require("express");
var session = require("express-session");
const productRoute = express.Router();

const {
  profile,
  updateUser,
  getusers,
  add,
  deleteUser,
} = require("../../controller/products/products");

productRoute.route("/products").post(add);
productRoute.route("/products").get(getusers);
productRoute.route("/products/:id").get(getusers);
productRoute.route("/products/:id/reviews").get(profile);
productRoute.route("/products/:id").patch(updateUser);
productRoute.route("/products/:id").put(updateUser);
productRoute.route("/products/:id").delete(deleteUser);
