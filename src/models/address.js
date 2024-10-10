const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  // User Reference
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Address Type
  type: {
    type: String,
    enum: ['Billing', 'Shipping', 'Both', 'Office', 'Home', 'Warehouse'],
    default: 'Billing'
  },

  // Personal/Business Information
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  company: { type: String, default: '' },
  department: { type: String, default: '' },  // For business addresses

  // Address Lines
  addressLine1: { type: String, required: true },
  addressLine2: { type: String, default: '' },
  addressLine3: { type: String, default: '' },  // Additional line for extended addresses
  landmark: { type: String, default: '' },
  
  // Location Information
  state: { type: String, required: true },
  region: { type: String, default: '' },  // State/Province/Region
  country: { type: String, required: true },
  city: { type: String, required: true },
  postalCode: { type: String, required: true },
  timezone: { type: String, default: '' },  // Timezone of the address

  // Geolocation Data
  coordinates: {
    lat: { type: Number, default: null },
    long: { type: Number, default: null }
  },

  // Additional Attributes
  isDefault: { type: Boolean, default: false },
  additionalNotes: { type: String, default: '' },
  isResidential: { type: Boolean, default: true },  // Indicates residential or commercial
  isPrimaryAddress: { type: Boolean, default: false },  // User's main address
  contactName: { type: String, default: '' },  // Contact person other than the user
  deliveryInstructions: { type: String, default: '' },  // Specific delivery guidance
  floorOrUnitNumber: { type: String, default: '' },  // For buildings or apartments
  buildingOrComplex: { type: String, default: '' },  // Apartment complex or office building name
  nearestPublicTransport: { type: String, default: '' },  // Nearest transport option for convenience
  addressTag: { type: String, enum: ['Home', 'Work', 'Other'], default: 'Home' },  // Custom tag for quick reference

  // Validation and Verification
  isVerified: { type: Boolean, default: false },  // Status if address is verified by admin
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // Admin who verified the address
  verificationDate: { type: Date },  // Date when address was verified

  // Logistical Information
  shippingCarrier: { type: String, default: '' },  // Preferred carrier for deliveries
  deliveryDays: { type: Number, default: 0 },  // Average delivery days to this address
  estimatedDeliveryCost: { type: Number, default: 0 },  // Estimated delivery cost
  applicableTaxRate: { type: Number, default: 0 },  // Tax rate based on the address
  customsInformation: { 
    hsCode: { type: String, default: '' },  // Harmonized System Code for shipping
    importDuty: { type: Number, default: 0 },  // Duty rate for international shipments
    clearanceRequired: { type: Boolean, default: false }  // If address requires customs clearance
  },

  // Meta Fields
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Address = mongoose.model('Address', addressSchema);

module.exports = Address;
