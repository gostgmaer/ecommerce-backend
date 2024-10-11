// const router = require("express").Router();
const express = require("express");
const settingRoute = express.Router();


const {
  addGlobalSetting,
  getGlobalSetting,
  updateGlobalSetting,
} = require("../controller/setting/settingController");

//add a global setting
settingRoute.route("/global/add").post(addGlobalSetting);

//get global setting
settingRoute.route("/global/:website/fetch").get(getGlobalSetting);

//update global setting
settingRoute.route("/global/update").put(updateGlobalSetting);

module.exports = settingRoute;
