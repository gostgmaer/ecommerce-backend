const {
  ReasonPhrases,
  StatusCodes,
  getReasonPhrase,
  getStatusCode,
} = require("http-status-codes");
const { FilterOptions } = require("../../utils/helper");
const paypal = require("paypal-rest-sdk");
const {
  jwtSecret,
  refressSecret,
  paypalClient,
  paypalSecret,
  stripePublic,
  stripeSecret,
} = require("../../config/setting");
const User = require("../../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const sessionStore = require("../../db/sessionConnact");
const createMailOptions = require("../../email/mailOptions");
const transporter = require("../../email/mailTransporter");
const Product = require("../../models/products");

paypal.configure({
  mode: "sandbox", // Change to 'live' for production
  client_id: paypalClient,
  client_secret: paypalSecret,
});

const processPayment = async (req, res) => {

    try {
        // Validate the request body
     
    
        // Calculate subTotal and fetch product details
        const productsWithDetails = await Promise.all(req.body.products.map(async (item) => {
          const productDetails = await Product.findById(item.product);
          if (!productDetails) {
            throw new Error(`Product with ID ${item.product} not found.`);
          }
          return {
            product: productDetails,
            quantity: item.quantity,
          };
        }));
    
        const subTotal = productsWithDetails.reduce((total, item) => {
          return total + item.product.price * item.quantity;
        }, 0);
    
        // Add shipping charges (adjust as needed)
        const shippingCharges = 5; // Assuming $5 for shipping
        const total = subTotal + shippingCharges;
    
        // Create the order record
        const order = new Order({
          user: new mongoose.Types.ObjectId(), // Set the user ID based on your authentication
          ...req.body,
          products: productsWithDetails,
          subTotal,
          total,
        });
    
        // Save the order to the database
        await order.save();
    
        res.status(201).json(order);
      } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal Server Error' });
      }


};

module.exports = {
  processPayment,
};
