const express = require("express");
var session = require("express-session");
const publicRoute = express.Router();

const {
    gethomeDetails,getSingleProductDetails
} = require("../controller/public/home");

publicRoute.route("/home/data").get(gethomeDetails);

publicRoute.route("/product/details").get(getSingleProductDetails);


module.exports = publicRoute;