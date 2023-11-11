const express = require("express");
var session = require("express-session");
const logRoute = express.Router();

const {
  getAllLogs,
  getSingleLogs,
  updateLogs,
  deleteLogs,
} = require("../controller/logs/log");

logRoute.route("/logs").get(getAllLogs);
logRoute.route("/logs/:id").get(getSingleLogs);
logRoute.route("/logs/:id").patch(updateLogs);
logRoute.route("/logs/:id").put(updateLogs);
logRoute.route("/logs/:id").delete(deleteLogs);



module.exports = logRoute;