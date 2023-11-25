const express = require("express");
var session = require("express-session");
const publicRoute = express.Router();

const {
    gethomeDetails,getSingleProductDetails,getProductsSearch
} = require("../controller/public/home");

publicRoute.route("/home/data").get(gethomeDetails);

publicRoute.route("/product/details").get(getSingleProductDetails);
publicRoute.route("/product/search/data").get(getProductsSearch);


module.exports = publicRoute;