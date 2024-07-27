const {
  ReasonPhrases,
  StatusCodes,
  getReasonPhrase,
  getStatusCode,
} = require("http-status-codes");
const paypal = require("paypal-rest-sdk");
const { FilterOptions } = require("../../utils/helper");
const Order = require("../../models/orders");
const User = require("../../models/user");
const Product = require("../../models/products");

const createOrder = async (req, res) => {
  const { user } = req.body;
  try {
    const userData = req.body.user;
    let user = await User.findOne({ email: userData.email });

    // If the user doesn't exist, create a new user account
    if (!user) {
      const newUser = new User(userData);
      user = await newUser.save();
    }
    // Process each product in the request body
    const items = req.body.products.map(async (productData) => {
      const productId = productData.productId;
      const product = await Product.findById(productId);

      if (!product) {
        return res
          .status(404)
          .json({ error: `Product with ID ${productId} not found` });
      }

      return {
        product: productId,
        quantity: productData.quantity,
        productName: product.productName,
        productImage: product.productImage,
        productPrice: product.productPrice,
        // Add other product details as needed
      };
    });

    const orders = await Promise.all(items);

    // Calculate the total order amount
    const total = orders.reduce(
      (acc, item) => acc + item.quantity * item.productPrice,
      0
    );

    // Create a new order
    const newOrder = new Order({
      user: user._id,
      items: items,
      total: total,
      // Add other order details as needed
    });

    // Save the order to the database
    const savedOrder = await newOrder.save();

    // Create a PayPal payment
    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: "YOUR_RETURN_URL",
        cancel_url: "YOUR_CANCEL_URL",
      },
      transactions: [
        {
          item_list: {
            items: orders.map((item) => {
              return {
                name: item.productName,
                sku: item.product.toString(),
                price: item.productPrice,
                currency: "USD",
                quantity: item.quantity,
              };
            }),
          },
          amount: {
            currency: "USD",
            total: total,
          },
          description: "Your order description",
        },
      ],
    };

    paypal.payment.create(create_payment_json, function (error, payment) {
      if (error) {
        throw error;
      } else {
        // Redirect the user to PayPal for approval
        res.redirect(payment.links[1].href);
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

const getOrders = async (req, res) => {
  try {
    const { sort, page, limit, filter } = req.query;

    const filterquery = FilterOptions(sort, page, limit, filter);
    const Orders = await Order.find(
      filterquery.query,
      "-__v ",
      filterquery.options
    )
      .populate("user") // Populating the 'user' reference
      .populate("items.product") // Populating the 'product' reference within 'items'
      .populate("address.billing") // Populating the 'billing' reference within 'address'
      .populate("address.shipping"); // Populating the 'shipping' reference within 'address'

      const length = await Order.countDocuments(filterquery.query);

    if (Orders) {
      Orders.forEach((element) => {
        const { firstName, lastName, email, phoneNumber } = element.user;
        element.user = {
          firstName,
          lastName,
          email,
          phoneNumber,
        };
      });

      return res.status(StatusCodes.OK).json({
        message: `Orders data has been Loaded Successfully!`,
        statusCode: StatusCodes.OK,
        status: ReasonPhrases.OK,
        results: Orders,
        total: length,
      });
    } else {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: `No information found`,
        statusCode: StatusCodes.NOT_FOUND,
        status: ReasonPhrases.NOT_FOUND,
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

const getSingleOrder = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Order id is not provide",
      statusCode: StatusCodes.BAD_REQUEST,
      status: ReasonPhrases.BAD_REQUEST,
    });
  } else {
    try {
      const OrderId = await Order.findOne({ _id: id }, "-__v");

      if (OrderId.id) {
        return res.status(StatusCodes.OK).json({
          message: `Orderdata data Loaded Successfully!`,
          statusCode: StatusCodes.OK,
          status: ReasonPhrases.OK,
          results: OrderId,
        });
      } else {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: `No information found for given id`,
          statusCode: StatusCodes.NOT_FOUND,
          status: ReasonPhrases.NOT_FOUND,
        });
      }
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        status: ReasonPhrases.INTERNAL_SERVER_ERROR,
      });
    }
  }
};

const updateOrder = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: "Order id is not provide",
        statusCode: StatusCodes.BAD_REQUEST,
        status: ReasonPhrases.BAD_REQUEST,
      });
    }

    const update = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (update) {
      res.status(StatusCodes.OK).json({
        message: "Order Update Successfully",
        status: ReasonPhrases.OK,
        statusCode: StatusCodes.OK,
      });
    } else {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: "Order does not exist..!",
        statusCode: StatusCodes.BAD_REQUEST,
        status: ReasonPhrases.BAD_REQUEST,
      });
    }
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      status: ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: "id is not provide",
        statusCode: StatusCodes.BAD_REQUEST,
        status: ReasonPhrases.BAD_REQUEST,
      });
    }

    const Order = await Order.findOne({ _id: id });
    if (!Order) {
      res.status(StatusCodes.NOT_FOUND).json({
        message: "Order does not exist..!",
        statusCode: StatusCodes.NOT_FOUND,
        status: ReasonPhrases.NOT_FOUND,
      });
    } else {
      Order.deleteOne({ _id: id }).then((data, err) => {
        if (err)
          res.status(StatusCodes.NOT_IMPLEMENTED).json({
            message: "Delete Failed",
            status: ReasonPhrases.NOT_IMPLEMENTED,
            statusCode: StatusCodes.NOT_IMPLEMENTED,
            cause: err,
          });
        else {
          res.status(StatusCodes.OK).json({
            message: "Delete Success",
            status: ReasonPhrases.OK,
            statusCode: StatusCodes.OK,
            data: data,
          });
        }
      });
    }
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      status: ReasonPhrases.INTERNAL_SERVER_ERROR,
      cause: error,
    });
  }
};

module.exports = {
  updateOrder,
  getOrders,
  getSingleOrder,
  deleteOrder,
  createOrder,
};
