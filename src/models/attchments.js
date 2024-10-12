const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  filename: String,
  originalname: String,
  contentType: String,
  url:String,
  uploadDate: { type: Date, default: Date.now },
  
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  updated_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Attachments = mongoose.model('Attachments', fileSchema);

module.exports = Attachments;