const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  // Basic Information
  title: { type: String, required: true },
  couponCode: { type: String, required: true, unique: true },
  description: { type: String, default: "" },
  termsAndConditions: { type: String, default: "" },
  logo: { type: String },  // URL for coupon image/logo

  // Discount Details
  discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
  couponType: { 
    type: String, 
    enum: ['cart', 'product'], 
    required: true 
  },
  discountValue: { type: Number, required: true },
  maxDiscount: { type: Number, default: null },
  maxSavingsCap: { type: Number, default: null },  // Overall cap on savings
  minOrderAmount: { type: Number, default: 0 },
  minQuantityRequired: { type: Number, default: 1 },  // Minimum item quantity in order

  // Validity
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  applicableDaysOfWeek: [
    { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] }
  ],
  applicableTimeRange: {
    start: { type: String, default: '00:00' },
    end: { type: String, default: '23:59' },
  },

  // Applicability
  applicableCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  applicableProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  productType: { type: String, required: true },
  regionRestrictions: [{ type: String, default: [] }],  // Country/region restrictions
  storeLocation: { type: String, default: "" },  // Specific stores/locations
  customerGroup: { type: String, default: "" },  // Targeted customer group (e.g., "VIP")

  // Eligibility Requirements
  requiresAccount: { type: Boolean, default: false },
  isFirstTimeUser: { type: Boolean, default: false },
  targetedUserEmailList: [{ type: String, default: [] }],
  applicablePaymentMethods: [{ type: String, default: [] }],  // Payment methods (e.g., "Credit Card")

  // Usage Limits
  usageLimit: { type: Number, default: 1 },       // Total number of times the coupon can be used
  userUsageLimit: { type: Number, default: 1 },   // Max times a single user can use the coupon
  redemptionHistory: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      redeemedAt: { type: Date },
    }
  ],  // Records each usage for tracking

  // Stacking and Restrictions
  isActive: { type: Boolean, default: true },
  isExclusive: { type: Boolean, default: false },
  stackable: { type: Boolean, default: false },  // Whether it can be combined with other coupons
  appliesOnShipping: { type: Boolean, default: false },
  applyOnTax: { type: Boolean, default: false }, // Apply discount on tax as well

  // Currency and Location
  currency: { type: String, default: 'USD' },  // Currency for the discount
  applicableOrderTypes: [{ type: String, enum: ['online', 'in-store', 'pickup'], default: ['online'] }],

  // Analytics and Tracking
 
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  updated_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },  // Admin or user who created the coupon
  tags: [{ type: String, default: [] }],  // Tags for categorization and search (e.g., "holiday", "VIP")
  
  // Seasonal/Conditional
  eventRelated: { type: String, default: "" },  // Related event or holiday (e.g., "Black Friday")
  specialConditions: { type: String, default: "" },  // Any unique conditions
  oneTimeUse: { type: Boolean, default: false },  // Can be used only once by each user
  
}, { timestamps: true });






module.exports = mongoose.model('Coupon', couponSchema);
