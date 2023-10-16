// logMiddleware.js
const LogEntry = require("../models/log/logEntry");
const {getLocationInfo} = require("../utils/helper");
async function logMiddleware(req, res, next) {
  try {
    const ip = req.ip; // Get the request's IP address
    const locationInfo = await getLocationInfo(ip);

    const logEntry = new LogEntry({
      method: req.method,
      path: req.originalUrl,
      body: req.body,
      query: req.query,
      params: req.params,
      ip: locationInfo.ip,
      location: {
        city: locationInfo.city,
        region: locationInfo.region,
        country: locationInfo.country,
        zip: locationInfo.zip,
      },
      response: {
        statusCode: res.statusCode,
        body: res.locals.responseData || {},
      },
    });
    await logEntry.save();
  } catch (err) {
    console.error("Error saving log entry:", err);
  }
  next();
}

module.exports = logMiddleware;
