// logEntry.js
const mongoose = require("mongoose");

const logEntrySchema = new mongoose.Schema({
  method: String,
  path: String,
  body: Object,
  query: Object,
  params: Object,
}, { timestamps: true });

module.exports = mongoose.model("LogEntry", logEntrySchema);
