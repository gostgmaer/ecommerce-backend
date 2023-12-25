const express = require("express");
var session = require("express-session");
const publicRoute = express.Router();

const {
    gethomeDetails,getSingleProductDetails,getProductsSearch,publicCategoriesDetails,getPublicBrands
} = require("../controller/public/home");

publicRoute.route("/public/home/data").get(gethomeDetails);

publicRoute.route("/public/product/details").get(getSingleProductDetails);
publicRoute.route("/public/product/search").get(getProductsSearch);
publicRoute.route("/public/categories").get(publicCategoriesDetails);
publicRoute.route("/public/brands").get(getPublicBrands);


module.exports = publicRoute;