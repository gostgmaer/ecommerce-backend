const {
  ReasonPhrases,
  StatusCodes,
  getReasonPhrase,
  getStatusCode,
} = require("http-status-codes");
const { FilterOptions } = require("../../utils/helper");
const Razorpay = require("razorpay");

const paypal = require("@paypal/checkout-server-sdk");
const {
  jwtSecret,
  refressSecret,
  paypalClient,
  paypalSecret,
  stripePublic,
  stripeSecret,
  razorPayPublic,
  razorPaySecret,
} = require("../../config/setting");
const User = require("../../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const sessionStore = require("../../db/sessionConnact");
const createMailOptions = require("../../email/mailOptions");
const transporter = require("../../email/mailTransporter");
const Product = require("../../models/products");
const Order = require("../../models/orders");

// paypal.configure({
//   mode: "sandbox", // Change to 'live' for production
//   client_id: paypalClient,
//   client_secret: paypalSecret,
// });

const processPayment = async (req, res) => {
  try {
    // Validate the request body

    // Calculate subTotal and fetch product details
    const productsWithDetails = await Promise.all(
      req.body.products.map(async (item) => {
        const productDetails = await Product.findById(item.product);
        if (!productDetails) {
          throw new Error(`Product with ID ${item.product} not found.`);
        }
        return {
          product: productDetails,
          quantity: item.quantity,
        };
      })
    );

    const subTotal = productsWithDetails.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);

    // Add shipping charges (adjust as needed)
    const shippingCharges = 5; // Assuming $5 for shipping
    const total = subTotal + shippingCharges;

    // Determine the payment method from the request body
    const paymentMethod = "razorpay";

    let paymentResult;

    if (paymentMethod === "paypal") {
      // Implement PayPal payment logic here
      // Replace the following line with actual PayPal integration code
      paymentResult = await payWithPayPal(total);
    } else if (paymentMethod === "razorpay") {
      // Implement Razor Pay payment logic here
      // Replace the following line with actual Razor Pay integration code
      paymentResult = await payWithRazorPay(total, req.body.user);
    } else {
      throw new Error("Invalid payment method");
    }

    // If payment is successful, create the order record
    if (paymentResult.success) {
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
    } else {
      // Handle payment failure
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: paymentResult,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        status: ReasonPhrases.INTERNAL_SERVER_ERROR,
      });
    }
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      status: ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }
};

// Replace the following functions with actual PayPal and Razor Pay integration logic
async function payWithPayPal(amount) {
  const environment = new paypal.core.SandboxEnvironment(
    paypalClient,
    paypalSecret
  );
  const client = new paypal.core.PayPalHttpClient(environment);

  try {
    // Create an order request
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: amount.toString(),
          },
        },
      ],
    });

    // Create the order
    const response = await client.execute(request);

    // Capture the order for payment
    const captureRequest = new paypal.orders.OrdersCaptureRequest(
      response.result.id
    );
    captureRequest.requestBody({});

    const captureResponse = await client.execute(captureRequest);

    // Return success along with PayPal payment ID
    return { success: true, paymentId: captureResponse.result.id };
  } catch (error) {
    console.error("PayPal error:", error.message);
    return { success: false, message: error.message };
  }
}

async function payWithRazorPay(amount, id) {
  var instance = new Razorpay({
    key_id: razorPayPublic,
    key_secret: razorPaySecret,
  });

  try {
    // Create a Razor Pay order
    const amountData = Number(amount.toFixed(2))
    var options = {
      amount: amount.toFixed(2), // amount in the smallest currency unit
      currency: "INR",
      receipt: id,
    };

  const orderData = await instance.orders.create(options, function (err, order) {
    console.log(err);
      if (err) {
        return { success: false, message: err.message };
      } else {
        return { success: true, order };
      }
    });

  } catch (error) {
    console.error("Razor Pay error:", error.message);
    return { success: false, message: error.message };
  }
}

module.exports = {
  processPayment,
};
