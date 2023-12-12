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
  host,
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
      return_url: `${host}/checkout/success`,
      cancel_url: `${host}/checkout/cancel`,
    },
    transactions: [
      {
        item_list: {
          items: req.body.productItems,
        },
        amount: {
          currency: "USD",
          total: req.body.total,
        },
        description: "Hat for the best team ever",
      },
    ],
  };

  try {
    paypal.payment.create(create_payment_json, async function (error, payment) {
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

        const transObj = {
          payer: payment.payer,
          transsaction_id: payment.id,
          transactions: payment.transactions,
          status: "pending",
          total: req.body.total,
          currency: req.body.currency,
          orderCreatedtime: payment.create_time,
        };

        const order = new Order({ ...req.body, ...transObj });
        const saveOrder = await order.save();
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
  const { PayerID, paymentId, token } = req.body;

  try {
    const order = await Order.findOne({ transsaction_id: paymentId });

    const trans = paypal.payment.get(paymentId, (err, data) => {
      if (err) {
        console.log(err.message);
      } else {
        var newTrans = [];

        data.transactions.map((item) => {
          const obj = {
            amount: {
              currency: item.amount.currency,
              total: item.amount.total,
            },
          };
          newTrans.push(obj);
        });

        const execute_payment_json = {
          payer_id: PayerID,
          transactions: newTrans,
        };

        paypal.payment.execute(
          paymentId,
          execute_payment_json,
          async function (error, payment) {
            if (error) {
              return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: error.message,
                statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
                status: ReasonPhrases.INTERNAL_SERVER_ERROR,
              });
            } else {
              const transObj = {
                payer: payment.payer,
                transactions: payment.transactions,
                status:
                  payment.state == "approved" ? "confirmed" : "pending_payment",
              };
              const updateOrder = await Order.findByIdAndUpdate(
                order.id,
                transObj,
                { new: true }
              );
              return res.status(StatusCodes.OK).json({
                results: updateOrder,
                statusCode: StatusCodes.OK,
                status: ReasonPhrases.OK,
              });
            }
          }
        );
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

const paymentCancel = async (req, res) => {
  try {
    const { token } = req.body;
    return res.status(StatusCodes.OK).json({
      results: {},
      statusCode: StatusCodes.OK,
      status: ReasonPhrases.OK,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      status: ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }

  // paypal.payment.execute(
  //   paymentId,
  //   execute_payment_json,
  //   function (error, payment) {
  //     if (error) {
  //       return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
  //         message: error.message,
  //         statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
  //         status: ReasonPhrases.INTERNAL_SERVER_ERROR,
  //       });
  //     } else {
  //       return res.status(StatusCodes.OK).json({
  //         results: payment,
  //         statusCode: StatusCodes.OK,
  //         status: ReasonPhrases.OK,
  //       });
  //     }
  //   }
  // );
};

module.exports = {
  processPaymenGategay,
  paymentSuccess,
  paymentCancel,
};
