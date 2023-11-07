const express = require("express");
var session = require("express-session");
const publicRoute = express.Router();

const {
    gethomeDetails
} = require("../controller/public/home");

publicRoute.route("/home/data").get(gethomeDetails);


module.exports = publicRoute;