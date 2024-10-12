const mongoose = require('mongoose');

const contactUsSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String
  },
  company: {
    type: String
  },
  subject: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  updated_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  isAgreed: {
    type: String,
    required: false
  },
  category: {
    type: String,
    enum: ['General Inquiry', 'Technical Support', 'Feedback', 'Other']
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  status: {
    type: String,
  },
  userAgent: {
    type: String
  },
  ipAddress: {
    type: String
  }
},{ timestamps: true });

const Contact = mongoose.model('Contact', contactUsSchema);

module.exports = Contact;
