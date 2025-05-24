const express = require("express");
const orderRoute = express.Router();
const UpdatebyMiddleWare = require("../middleware/updatedBy");
const createMiddleWare = require("../middleware/createMiddleWare");
const userMiddleWare = require("../middleware/userAccess");

const {
  updateOrder,
  getOrders,
  getSingleOrder,
  deleteOrder,
  createOrder,getCustomerOrders,getCustomerDashboard,cancelOrder,
  verifyPayment
} = require("../controller/orders/orders");



orderRoute.route("/orders/create").post(userMiddleWare,createMiddleWare,createOrder);
orderRoute.route("/orders/cancel/:id").patch(userMiddleWare,createMiddleWare,cancelOrder);
orderRoute.route("/orders/verify-payment").post(userMiddleWare,UpdatebyMiddleWare,verifyPayment);
orderRoute.route("/orders").get(userMiddleWare,getOrders);
orderRoute.route("/orders/:id").get(userMiddleWare,getSingleOrder);
orderRoute.route("/orders/:id").put(userMiddleWare,UpdatebyMiddleWare,updateOrder);
orderRoute.route("/orders/:id").patch(userMiddleWare,UpdatebyMiddleWare,updateOrder);
orderRoute.route("/orders/:id").delete(userMiddleWare,UpdatebyMiddleWare,deleteOrder);
orderRoute.route("/orders/user/:userId").get(userMiddleWare,getOrders);
orderRoute.route("/orders/customer/fetch").get(userMiddleWare,getCustomerOrders);
orderRoute.route("/orders/customer/dashboard").get(userMiddleWare,getCustomerDashboard);
orderRoute.route("/orders/user/:userId/:orderId").get(userMiddleWare);
orderRoute.route("/orders/user/:userId/:orderId").patch(userMiddleWare,UpdatebyMiddleWare);
orderRoute.route("/orders/user/:userId/:orderId").put(userMiddleWare,UpdatebyMiddleWare);
orderRoute.route("/orders/user/:userId/:orderId").delete(userMiddleWare);


module.exports = orderRoute;