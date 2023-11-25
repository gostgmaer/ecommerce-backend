const express = require("express");
const BrandRoute = express.Router();

const {
    create,
    get,
    getSingle,
    update,
    remove,
} = require("../controller/brands/brand");

BrandRoute.route("/brands").post(create);
BrandRoute.route("/brands").get(get);
BrandRoute.route("/brands/:id").get(getSingle);
BrandRoute.route("/brands/:id").put(update);
BrandRoute.route("/brands/:id").patch(update);
BrandRoute.route("/brands/:id").delete(remove);

module.exports = BrandRoute;