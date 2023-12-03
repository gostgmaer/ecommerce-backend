const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming there's a User model to reference
    required: true
  },
  addressname: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  company: {
    type: String
  },
  state: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  apartment: {
    type: String
  },
  city: {
    type: String,
    required: true
  },
  postalCode: {
    type: String,
    required: true
  },
  street: {
    type: String,
    required: true
  }
});

const Address = mongoose.model('Address', addressSchema);

module.exports = Address;
