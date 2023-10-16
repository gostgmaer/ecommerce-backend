const express = require("express");
var session = require("express-session");
const orderRoute = express.Router();
const UpdatebyMiddleWare = require("../../middleware/updatedBy");
const createMiddleWare = require("../../middleware/createMiddleWare");
const userMiddleWare = require("../../middleware/userAccess");
const adminMiddleware = require("../../middleware/adminAccess");


const {
  updateOrder,
  getOrders,
  getSingleOrder,
  deleteOrder,
  createOrder,
} = require("../../controller/orders/orders");

orderRoute.route("/orders").post(userMiddleWare,createMiddleWare,createOrder);
orderRoute.route("/orders").get(adminMiddleware,getOrders);
orderRoute.route("/orders/:id").get(userMiddleWare,getSingleOrder);
orderRoute.route("/orders/:id").put(userMiddleWare,UpdatebyMiddleWare,updateOrder);
orderRoute.route("/orders/:id").patch(userMiddleWare,UpdatebyMiddleWare,updateOrder);
orderRoute.route("/orders/:id").delete(userMiddleWare,UpdatebyMiddleWare,deleteOrder);
orderRoute.route("/orders/user/:userId").get(userMiddleWare);
orderRoute.route("/orders/user/:userId/:orderId").get(userMiddleWare);
orderRoute.route("/orders/user/:userId/:orderId").patch(userMiddleWare,UpdatebyMiddleWare);
orderRoute.route("/orders/user/:userId/:orderId").put(userMiddleWare,UpdatebyMiddleWare);
orderRoute.route("/orders/user/:userId/:orderId").delete(userMiddleWare);