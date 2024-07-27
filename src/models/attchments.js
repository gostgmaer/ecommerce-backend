const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  filename: String,
  originalname: String,
  contentType: String,
  url:String,
  uploadDate: { type: Date, default: Date.now },
});

const Attachments = mongoose.model('Attachments', fileSchema);

module.exports = Attachments;