const {
  ReasonPhrases,
  StatusCodes,
  getReasonPhrase,
  getStatusCode,
} = require("http-status-codes");
const { FilterOptions } = require("../../utils/helper");
const Razorpay = require("razorpay");
const currency = require("currency.js");

var paypal = require("paypal-rest-sdk");
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

// const processPayment = async (req, res) => {
//   try {
//     // Validate the request body

//     // Calculate subTotal and fetch product details
//     const productsWithDetails = await Promise.all(
//       req.body.products.map(async (item) => {
//         const productDetails = await Product.findById(item.product);
//         if (!productDetails) {
//           throw new Error(`Product with ID ${item.product} not found.`);
//         }
//         return {
//           product: productDetails,
//           quantity: item.quantity,
//         };
//       })
//     );

//     const subTotal = productsWithDetails.reduce((total, item) => {
//       return total + item.product.price * item.quantity;
//     }, 0);

//     // Add shipping charges (adjust as needed)
//     const shippingCharges = 5; // Assuming $5 for shipping
//     const total = subTotal + shippingCharges;

//     // Determine the payment method from the request body
//     const paymentMethod = "razorpay";

//     let paymentResult;

//     if (paymentMethod === "paypal") {
//       // Implement PayPal payment logic here
//       // Replace the following line with actual PayPal integration code
//       paymentResult = await payWithPayPal(total);
//     } else if (paymentMethod === "razorpay") {
//       // Implement Razor Pay payment logic here
//       // Replace the following line with actual Razor Pay integration code
//       paymentResult = await payWithRazorPay(total, req.body.user);

//       console.log(paymentResult);
//     } else {
//       throw new Error("Invalid payment method");
//     }

//     // If payment is successful, create the order record
//     if (paymentResult.success) {
//       const order = new Order({
//         user: new mongoose.Types.ObjectId(), // Set the user ID based on your authentication
//         ...req.body,
//         products: productsWithDetails,
//         subTotal,
//         total,
//       });

//       // Save the order to the database
//       await order.save();

//       res.status(201).json(order);
//     } else {
//       // Handle payment failure
//       return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//         message: paymentResult,
//         statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
//         status: ReasonPhrases.INTERNAL_SERVER_ERROR,
//       });
//     }
//   } catch (error) {
//     return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//       message: error.message,
//       statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
//       status: ReasonPhrases.INTERNAL_SERVER_ERROR,
//     });
//   }
// };

// Replace the following functions with actual PayPal and Razor Pay integration logic
// async function payWithPayPal(amount) {
//   const environment = new paypal.core.SandboxEnvironment(
//     paypalClient,
//     paypalSecret
//   );
//   const client = new paypal.core.PayPalHttpClient(environment);

//   try {
//     // Create an order request
//     const request = new paypal.orders.OrdersCreateRequest();
//     request.prefer("return=representation");
//     request.requestBody({
//       intent: "CAPTURE",
//       purchase_units: [
//         {
//           amount: {
//             currency_code: "USD",
//             value: amount.toString(),
//           },
//         },
//       ],
//     });

//     // Create the order
//     const response = await client.execute(request);

//     // Capture the order for payment
//     const captureRequest = new paypal.orders.OrdersCaptureRequest(
//       response.result.id
//     );
//     captureRequest.requestBody({});

//     const captureResponse = await client.execute(captureRequest);

//     // Return success along with PayPal payment ID
//     return { success: true, paymentId: captureResponse.result.id };
//   } catch (error) {
//     console.error("PayPal error:", error.message);
//     return { success: false, message: error.message };
//   }
// }

// var instance = new Razorpay({
//   key_id: razorPayPublic,
//   key_secret: razorPaySecret,
// });

// async function payWithRazorPay(amount, id) {
//   try {
//     // Create a Razor Pay order

//     //     var stringNumber = '1.00';
//     // var floatNumber = parseFloat(stringNumber);
//     // var value = currency("123.45");
//     // console.log(currency(value).value);

//     // Ensure two decimal places
//     // var numberWithTwoDecimals = floatNumber.toFixed(2);

//     // console.log(numberWithTwoDecimals);

//     var result;

//     var options = {
//       amount: 50000,
//       currency: "INR",
//       receipt: "receipt#1",
//       notes: {
//         key1: "value3",
//         key2: "value2",
//       },
//     };
//     instance.orders.create(options, function (err, order) {
//       if (err) {
//         result = { success: false, message: err.message };
//         return { success: false, message: err.message };
//       } else {
//         result = { success: true, order };
//         return { success: true, order };
//       }
//     });
//     return result;
//   } catch (error) {
//     console.error("Razor Pay error:", error.message);
//     return { success: false, message: error.message };
//   }
// }

paypal.configure({
  mode: "sandbox", //sandbox or live
  client_id: paypalClient,
  client_secret: paypalSecret,
});

const processPaymenGategay = async (req, res) => {
  const create_payment_json = {
    intent: "sale",
    payer: {
      payment_method: "paypal",
    },
    redirect_urls: {
      return_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/cancel",
    },
    transactions: [
      {
        item_list: {
          items: [
            {
              name: "Red Sox Hat",
              sku: "001",
              price: "25.00",
              currency: "USD",
              quantity: 1,
            },
          ],
        },
        amount: {
          currency: "USD",
          total: "25.00",
        },
        description: "Hat for the best team ever",
      },
    ],
  };

  try {
    // const payerId = req.query.PayerID;
    //   const paymentId = req.query.paymentId;

    //   const execute_payment_json = {
    //     payer_id: payerId,
    //     transactions: [
    //       {
    //         amount: {
    //           currency: "USD",
    //           total: "25.00",
    //         },
    //       },
    //     ],
    //   };

    //   paypal.payment.execute(
    //     paymentId,
    //     execute_payment_json,
    //     function (error, payment) {
    //       if (error) {
    //         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    //           message: error.message,
    //           statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    //           status: ReasonPhrases.INTERNAL_SERVER_ERROR,
    //         });
    //       } else {
    //         console.log(JSON.stringify(payment));
    //         res.send("Success");
    //       }
    //     }
    //   );

    paypal.payment.create(create_payment_json, function (error, payment) {
      if (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message: error.message,
          statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
          status: ReasonPhrases.INTERNAL_SERVER_ERROR,
        });
      } else {
        const redirectObj = payment.links.find(
          (item) => item.rel === "approval_url"
        );
        // res.redirect(redirectObj.href);
        return res.status(StatusCodes.OK).json({
          results: redirectObj,
          statusCode: StatusCodes.OK,
          status: ReasonPhrases.OK,
        });
      }
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      status: ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }
};

const paymentSuccess = async (req, res) => {
  var create_payment_json = {
    intent: "sale",
    payer: {
      payment_method: "paypal",
    },
    redirect_urls: {
      return_url: "http://return.url",
      cancel_url: "http://cancel.url",
    },
    transactions: [
      {
        item_list: {
          items: [
            {
              name: "item",
              sku: "item",
              price: "1.00",
              currency: "USD",
              quantity: 1,
            },
          ],
        },
        amount: {
          currency: "USD",
          total: "1.00",
        },
        description: "This is the payment description.",
      },
    ],
  };

  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;

  const execute_payment_json = {
    payer_id: payerId,
    transactions: [
      {
        amount: {
          currency: "USD",
          total: "25.00",
        },
      },
    ],
  };

  paypal.payment.execute(
    paymentId,
    execute_payment_json,
    function (error, payment) {
      if (error) {
        console.log(error.response);
        throw error;
      } else {
        console.log(JSON.stringify(payment));
        res.send("Success");
      }
    }
  );
};

module.exports = {
  processPaymenGategay,
};
