const {
  ReasonPhrases,
  StatusCodes,
  getReasonPhrase,
  getStatusCode,
} = require("http-status-codes");
const { FilterOptions } = require("../../utils/helper");
const Cart = require("../../models/cart");
const Product = require("../../models/products");

const createCart = async (req, res) => {
  // const { cartItems } = req.body;

  // Assuming you have an authenticated user object

  // const user = req.user;

  try {
    const iscart = await Cart.findOne({ user: req.body.created_user_id });

    if (req.body) {
      var myArr = [];
      // cartItems.forEach((element) => {
      //   const { product, quantity, subtotal } = element;
      //   const obj = {
      //     quantity,
      //     subtotal,
      //     product: product._id,
      //   };

      //   myArr.push(obj);
      // });
      var body = { user: req.body.created_user_id };

      if (iscart) {
        myArr.forEach((newItem) => {
          const existingItem = iscart.items.find((item) =>
            item.product.equals(newItem.product)
          );

          if (existingItem) {
            // Product is already in the cart, update the quantity
            existingItem.quantity = newItem.quantity;
          } else {
            // Product is not in the cart, add it
            iscart.items.push(newItem);
          }
        });
        const updatedCart = await iscart.save();
        res.status(200).json(updatedCart);
      } else {
        const newCart = new Cart(body);
        const savedCart = await newCart.save();
        res.status(201).json(savedCart);
      }
    }
    // const product = await Product.findById(productId);
    // if (!product) {
    //   return res.status(404).json({ error: "Product not found" });
    // }

    // let cart = await Cart.findOne({ user: user._id });

    // if (!cart) {
    //   cart = new Cart({ user: user._id, items: [] });
    // }

    // const existingCartItem = cart.items.find((item) =>
    //   item.product.equals(productId)
    // );
    // if (existingCartItem) {
    //   existingCartItem.quantity += quantity;
    // } else {
    //   cart.items.push({ product: productId, quantity });
    // }

    // await cart.save();

    // res.json(cart);
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      status: "Internal Server Error",
      results: null,
      message: error.message,
    });
  }
};

const getCarts = async (req, res) => {
  try {
    const Carts = await Cart.find();
    const length = await Cart.countDocuments();

    res.status(200).json({
      statusCode: 200,
      status: "OK",
      message: "Carts retrieved successfully",
      results: Carts,
      total: length,
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      status: "Internal Server Error",
      results: null,
      message: error.message,
    });
  }
};

const getSingleCarts = async (req, res) => {
  try {
    const Cart = await Cart.findById(req.params.id);
    if (!Cart) {
      return res.status(404).json({
        statusCode: 404,
        status: "Not Found",
        results: null,
        message: "Cart not found",
      });
    }
    res.status(200).json({
      statusCode: 200,
      status: "OK",
      results: Cart,
      message: "Cart retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      status: "Internal Server Error",
      results: null,
      message: error.message,
    });
  }
};
const updateCart = async (req, res) => {
  try {
    const Cart = await Cart.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!Cart) {
      return res.status(404).json({
        statusCode: 404,
        status: "Not Found",
        results: null,
        message: "Cart not found",
      });
    }
    res.status(200).json({
      statusCode: 200,
      status: "OK",
      results: Cart,
      message: "Cart updated successfully",
    });
  } catch (error) {
    res.status(400).json({
      statusCode: 400,
      status: "Bad Request",
      results: null,
      message: error.message,
    });
  }
};
const deleteCarts = async (req, res) => {
  try {
    const Cart = await Cart.findByIdAndDelete(req.params.id);
    if (!Cart) {
      return res.status(404).json({
        statusCode: 404,
        status: "Not Found",
        results: null,
        message: "Cart not found",
      });
    }
    res.status(200).json({
      statusCode: 200,
      status: "OK",
      results: null,
      message: "Cart deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      status: "Internal Server Error",
      results: null,
      message: error.message,
    });
  }
};
const updateSingleCart = async (req, res) => {
  try {
    const Cart = await Cart.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!Cart) {
      return res.status(404).json({
        statusCode: 404,
        status: "Not Found",
        results: null,
        message: "Cart not found",
      });
    }
    res.status(200).json({
      statusCode: 200,
      status: "OK",
      results: Cart,
      message: "Cart updated successfully",
    });
  } catch (error) {
    res.status(400).json({
      statusCode: 400,
      status: "Bad Request",
      results: null,
      message: error.message,
    });
  }
};

module.exports = {
  createCart,
  getCarts,
  getSingleCarts,
  updateCart,
  deleteCarts,
  updateSingleCart,
};
