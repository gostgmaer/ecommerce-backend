const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema(
  {
    siteName: { type: String, required: true },
    name: {
      type: String,
    },
    contactInfo: {
      email: { type: String, required: true },
      phone: { type: String },
      address: {
        street: { type: String },
        city: { type: String },
        state: { type: String },
        zipCode: { type: String },
        country: { type: String },
      },
    },
    branding: {
      logo: { type: String },
      favicon: { type: String },
      themeColor: { type: String, default: '#000000' }, // Default to black
    },

    shippingOptions: [{ type: String }], // e.g., ["Standard Shipping", "Express Shipping"]
    emailTemplates: {
      orderConfirmation: { type: String },
      passwordReset: { type: String },
    },

    seo: {
      title: { type: String },
      description: { type: String },
      keywords: [{ type: String }],
    },
    analytics: {
      googleAnalyticsID: { type: String },
      facebookPixelID: { type: String },
    },

    currency: { type: String, required: true, default: 'USD' },
    taxRate: { type: Number, default: 0 },
    logo: { type: String }, // URL or path to the logo
    favicon: { type: String }, // URL or path to the favicon
    paymentMethods: [{ type: String }], // e.g., ["Credit Card", "PayPal", "Cash on Delivery"]
    shippingMethods: [{ type: String }], // e.g., ["Standard Shipping", "Express Shipping"]
    orderConfirmationEmailTemplate: { type: String }, // HTML or text template
    passwordResetEmailTemplate: { type: String }, // HTML or text template
    smtpHost: { type: String }, // SMTP host for email
    smtpPort: { type: Number }, // SMTP port
    smtpUser: { type: String }, // SMTP username
    smtpPassword: { type: String }, // SMTP password
    socialMediaLinks: {
      facebook: { type: String },
      twitter: { type: String },
      instagram: { type: String },
      linkedin: { type: String },
      youtube: { type: String },
      pinterest: { type: String },
      tiktok: { type: String },
    },
    isLive: { type: Boolean, default: true }, // Whether the store is live
    maintenanceMode: { type: Boolean, default: false }, // Maintenance mode toggle
    featuredCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }], // Featured categories
    currencySymbol: { type: String, default: '$' }, // Currency symbol
    minOrderAmount: { type: Number, default: 0 }, // Minimum order amount for checkout
    maxOrderAmount: { type: Number }, // Maximum order amount for checkout
    loyaltyProgram: {
      enabled: { type: Boolean, default: false }, // Enable loyalty program
      pointsPerDollar: { type: Number, default: 1 }, // Points earned per dollar spent
    },
    returnPolicy: { type: String }, // Return policy description
    privacyPolicy: { type: String }, // Privacy policy description
    termsOfService: { type: String }, // Terms of service description
  },
  {
    timestamps: true,
  }
);

// Update timestamps
settingSchema.pre('save', function (next) {
  next();
});

const Setting = mongoose.model('Setting', settingSchema);

module.exports = Setting;
