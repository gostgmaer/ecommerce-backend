const {
  ReasonPhrases,
  StatusCodes,
} = require("http-status-codes");
// const paypal = require("paypal-rest-sdk");
const { FilterOptions } = require("../../utils/helper");
const Order = require("../../models/orders");
// const User = require("../../models/user");
const Product = require("../../models/products");

// const createOrder = async (req, res) => {

//   try {
//     const userData = req.body.user;
//     // let user = await User.findOne({ email: userData });

//     // // If the user doesn't exist, create a new user account
//     // if (!user) {
//     //   const newUser = new User(userData);
//     //   user = await newUser.save();
//     // }
//     // Process each product in the request body
//     let invalidProducts = [];
//     const items = req.body.products.map(async (productData) => {
//       const productId = productData.id;
//       const product = await Product.findById(productId);

//       if (!product) {
//         invalidProducts.push(productId);

//       } else {
//         return {
//           product: productId,
//           quantity: productData.cartQuantity,
//           productPrice: product.price,
//           // Add other product details as needed
//         };
//       }
//     });

//     if (invalidProducts.length > 0) {
//       return res.status(400).json({
//         message: "Invalid product(s) provided.",
//         invalidProducts: invalidProducts, // Return the list of invalid products
//         statusCode: StatusCodes.BAD_REQUEST,
//         status: ReasonPhrases.BAD_REQUEST,
//       });
//     }else{
//       const orders = await Promise.all(items);
//       const total = orders.reduce(
//         (acc, item) => acc + item.cartQuantity * item.price,
//         0
//       );

//       // Create a new order
//       const newOrder = new Order({

//         items: items,
//         total: total,
//         // Add other order details as needed
//       });

//       // Save the order to the database
//       const savedOrder = await newOrder.save();
//     }

//   } catch (error) {
//     return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//       message: error.message,
//       statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
//       status: ReasonPhrases.INTERNAL_SERVER_ERROR,
//     });
//   }
// };


const createOrder = async (req, res) => {
  try {
    // const userData = req.body.user;

    let invalidProducts = [];

    // Process each product in the request body
    const items = await Promise.all(
      req.body.products.map(async (productData) => {
        const productId = productData.id;
        const product = await Product.findById(productId);

        if (!product) {
          invalidProducts.push(productId);
          return null; // Return null for invalid products
        } else {
          return {
            product: productId,
            quantity: productData.cartQuantity,
            productPrice: product.price,
          };
        }
      })
    );

    if (invalidProducts.length > 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Invalid product(s) provided.",
        invalidProducts: invalidProducts,
        statusCode: StatusCodes.BAD_REQUEST,
        status: ReasonPhrases.BAD_REQUEST,
      });
    }

    const validItems = items.filter(item => item !== null); // Filter out invalid items

    const total = validItems.reduce(
      (acc, item) => acc + item.quantity * item.productPrice,
      0
    );

    // Create a new order

    if (req.body.payment_method === "COD") {
      req.body.status = "confirmed"
    }

    const newOrder = new Order({
      items: validItems,
      total: total, ...req.body
      // Add other order details as needed
    });

    // Save the order to the database
    const savedOrder = await newOrder.save();

    return res.status(StatusCodes.CREATED).json({
      message: "Order created successfully",
      result: savedOrder,
      statusCode: StatusCodes.CREATED,
      status: ReasonPhrases.CREATED,
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

const getCustomerOrders = async (req, res) => {
  try {
    const { sort, page, limit, filter } = req.query;

    const filterquery = FilterOptions(sort, page, limit, filter);
    const Orders = await Order.find(
      filterquery.query,
      "-__v ",
      filterquery.options
    ).populate("user") // Populating the 'user' reference
      .populate("items.product", '-_id -categories -category -variants -status') // Populating the 'product' reference within 'items'
      .populate("address")

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

const getCustomerDashboard = async (req, res) => {
  try {
    const { sort, page, limit, filter } = req.query;

    const filterquery = FilterOptions(sort, page, limit, filter);

    const orderStats = await Order.aggregate([
      {
        $match: {}  // Apply the provided filters (if any)
      },
      {
        $facet: {
          total: [
            { $count: "total" }  // Total number of orders
          ],
          pending: [
            { $match: { status: "pending" } },  // Orders with status 'pending'
            { $count: "pending" }
          ],
          confirmed: [
            { $match: { status: "confirmed" } },  // Orders with status 'pending'
            { $count: "confirmed" }
          ],
          success: [
            { $match: { status: "success" } },  // Orders with status 'success'
            { $count: "success" }
          ],
          failed: [
            { $match: { status: "failed" } },  // Orders with status 'failed'
            { $count: "failed" }
          ],
          cancelled: [
            { $match: { status: "cancelled" } },  // Orders with status 'cancelled'
            { $count: "cancelled" }
          ],
          shipped: [
            { $match: { status: "shipped" } },  // Orders with status 'shipped'
            { $count: "shipped" }
          ]
        }
      },
      {
        $project: {
          total: { $arrayElemAt: ["$total.total", 0] },
          pending: { $ifNull: [{ $arrayElemAt: ["$pending.pending", 0] }, 0] },
          success: { $ifNull: [{ $arrayElemAt: ["$success.success", 0] }, 0] },
          failed: { $ifNull: [{ $arrayElemAt: ["$failed.failed", 0] }, 0] },
          cancelled: { $ifNull: [{ $arrayElemAt: ["$cancelled.cancelled", 0] }, 0] },
          confirmed: { $ifNull: [{ $arrayElemAt: ["$confirmed.confirmed", 0] }, 0] },
          shipped: { $ifNull: [{ $arrayElemAt: ["$shipped.shipped", 0] }, 0] }
        }
      }
    ]);



    const Orders = await Order.find(
      filterquery.query,
      "-__v ",
      filterquery.options
    ).populate("user")

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
        results: {
          order: {
            data: Orders, total: length
          }, ...orderStats[0]
        }
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
      const OrderId = await Order.findOne({ _id: id }, "-__v").populate({
        path: 'items.product',
        model: 'Product' // Ensure this matches the name of your Product model
      }).exec();

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
  createOrder, getCustomerOrders, getCustomerDashboard
};
