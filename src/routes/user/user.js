const express = require("express");
var session = require("express-session");
const userRouter = express.Router();

const {
  profile,
  updateUser,
  getusers,
  deleteUser,
} = require("../../controller/user/user");

userRouter.route("/users/:id").get(profile);
userRouter.route("/users").get(getusers);
userRouter.route("/users/:id").patch(updateUser);
userRouter.route("/users/:id").put(updateUser);
userRouter.route("/users/:id").delete(deleteUser);
