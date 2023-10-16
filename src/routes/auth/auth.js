const express = require("express");
var session = require("express-session");
const authRoute = express.Router();

const {
  profile,
  updateUser,
  getusers,
  deleteUser,
} = require("../../controller/authentication/auth");

authRoute.route("/auth/register").post();
authRoute.route("/auth/confirm-account/:token").post();
authRoute.route("/auth/login").post();
authRoute.route("/auth/verify/session").post();
authRoute.route("/auth/reset-password/:token").post();
authRoute.route("/auth/forget-password").post();
authRoute.route("/auth/change-password").post();
authRoute.route("/auth/profile").get();
authRoute.route("/auth/logout").post();
