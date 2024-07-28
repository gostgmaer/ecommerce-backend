const express = require("express");

const userRouter = express.Router();
const UpdatebyMiddleWare = require("../middleware/updatedBy");
const userMiddleWare = require("../middleware/userAccess");
const adminMiddleware = require("../middleware/adminAccess");


const {
  updateUser,
  getusers,
  deleteUser,getSingleUser
} = require("../controller/user/user");

userRouter.route("/users").get(adminMiddleware, getusers);
userRouter.route("/users/:id").get(userMiddleWare,getSingleUser);
userRouter.route("/users/:id").patch(userMiddleWare,UpdatebyMiddleWare,updateUser);
userRouter.route("/users/:id").put(userMiddleWare,UpdatebyMiddleWare,updateUser);
userRouter.route("/users/:id").delete(adminMiddleware,deleteUser);


module.exports = userRouter;
