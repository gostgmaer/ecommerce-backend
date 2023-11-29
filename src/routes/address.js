const express = require("express");
const AddressRoute = express.Router();

const createMiddleWare = require("../middleware/createMiddleWare");

const {
  create,
  get,
  getSingle,
  update,
  remove,
  addAddress,
} = require("../controller/addresses/address");

AddressRoute.route("/address").post(createMiddleWare, create);
AddressRoute.route("/address/:id").get(createMiddleWare, getSingle);

AddressRoute.route("/address").get(createMiddleWare, get);
AddressRoute.route("/address/:id").patch(createMiddleWare, update);
AddressRoute.route("/address/:id").delete(createMiddleWare, remove);
AddressRoute.route("/address/:id/user/:user_id").post(
  createMiddleWare,
  addAddress
);

module.exports = AddressRoute;
