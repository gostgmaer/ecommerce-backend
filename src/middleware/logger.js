// logMiddleware.js
const LogEntry = require("../models/logEntry");
const { getLocationInfo,getLocalIpAddress } = require("../utils/helper");
async function logMiddleware(req, res, next) {
  try {
    const ip = await getLocalIpAddress()// Get the request's IP address
    const locationInfo = await getLocationInfo(ip.IPv4);

    const logEntry = new LogEntry({
      method: req.method,
      path: req.originalUrl,
      body: req.body,
      query: req.query,
      useragent: req.get("User-Agent"),
      params: req.params,
      ip:ip,
      location: locationInfo,
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


