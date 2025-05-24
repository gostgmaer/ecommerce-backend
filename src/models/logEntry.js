const mongoose = require("mongoose");

const logEntrySchema = new mongoose.Schema(
  {
    method: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
    body: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    query: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    params: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    useragent: {
      type: String,
    },
    response: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    ip: {
      type: String,
    },
    location: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("LogEntry", logEntrySchema);
