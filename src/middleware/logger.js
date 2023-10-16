// logMiddleware.js
const LogEntry = require("../models/log/logEntry");
async function logMiddleware(req, res, next) {
  try {
    const logEntry = new LogEntry({
      method: req.method,
      path: req.originalUrl,
      body: req.body,
      query: req.query,
      params: req.params,
      response: {
        statusCode: res.statusCode,
        body: res.locals.responseData || {}, // Add response data to 'responseData' in route handlers
      },
    });
    await logEntry.save();
  } catch (err) {
    console.error("Error saving log entry:", err);
  }
  next();
}

module.exports = logMiddleware;