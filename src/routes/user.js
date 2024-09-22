const express = require("express");

const userRouter = express.Router();
const UpdatebyMiddleWare = require("../middleware/updatedBy");
const userMiddleWare = require("../middleware/userAccess");
const adminMiddleware = require("../middleware/adminAccess");


const {
  updateUser,
  getusers,
  deleteUser,getSingleUser,getUserProfile
} = require("../controller/user/user");

userRouter.route("/users").get(userMiddleWare, getusers);
userRouter.route("/users/:id").get(userMiddleWare,getSingleUser);
userRouter.route("/users/customer/profile").get(userMiddleWare,getUserProfile);
userRouter.route("/users/:id").patch(userMiddleWare,UpdatebyMiddleWare,updateUser);
userRouter.route("/users/:id").put(userMiddleWare,UpdatebyMiddleWare,updateUser);
userRouter.route("/users/:id").delete(userMiddleWare,deleteUser);


module.exports = userRouter;
