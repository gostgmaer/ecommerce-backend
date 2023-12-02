const express = require("express");
var session = require("express-session");
const PaymentRoute = express.Router();
const UpdatebyMiddleWare = require("../middleware/updatedBy");
const createMiddleWare = require("../middleware/createMiddleWare");
const userMiddleWare = require("../middleware/userAccess");
const adminMiddleware = require("../middleware/adminAccess");

const checkoutMiddleware = require("../middleware/checkout");
const {
    processPayment
} = require("../controller/payment/payment");

PaymentRoute
  .route("/payment/checkout/process")
  .post(checkoutMiddleware,processPayment);

module.exports = PaymentRoute;
