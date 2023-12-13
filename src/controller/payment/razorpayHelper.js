// razorpayHelper.js
const Razorpay = require('razorpay');
const {
    jwtSecret,
    refressSecret,
    paypalClient,
    paypalSecret,
    host,
    stripePublic,
    stripeSecret,
    razorPayPublic,
    razorPaySecret,
  } = require("../../config/setting");
const razorpay = new Razorpay({
  key_id: razorPayPublic,
  key_secret: razorPaySecret,
});

async function createOrder(body) {
  const options = {
    amount: 50000, // amount in paise (50 INR)
    currency: 'INR',
    receipt: 'order_receipt_1',
    payment_capture: 1, // Auto capture payment when successful (0 for manual capture)
    notes: {
      merchant: 'MyApp',
    },
  };

  try {
    const response = await razorpay.orders.create(options);
    return response;
  } catch (error) {
    throw new Error('Unable to create order');
  }
}

function verifyPaymentSignature(rawBody, signature) {
  return razorpay.webhook.verifyHmac(rawBody, signature);
}

module.exports = {
  createOrder,
  verifyPaymentSignature,
};
