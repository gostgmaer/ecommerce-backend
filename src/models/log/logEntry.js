// logEntry.js
const mongoose = require("mongoose");

const logEntrySchema = new mongoose.Schema(
  {
    method: String,
    path: String,
    body: Object,
    query: Object,
    params: Object,
    response: Object,
    ip: String, // Add IP field
    location: {
      city: String,
      region: String,
      country: String,
      zip: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("LogEntry", logEntrySchema);
