const {
    ReasonPhrases,
    StatusCodes,
    getReasonPhrase,
    getStatusCode,
  } = require("http-status-codes");
  const { FilterOptions } = require("../../utils/helper");
  const Cart = require("../../models/cart/cart");
  
  const createCart = async (req, res) => {
    try {
      const Cart = new Cart(req.body);
      const savedCart = await Cart.save();
      res.status(201).json({
        statusCode: 201,
        status: "Created",
        results: {id:savedCart.id},
        message: "Cart created",
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
    deleteCarts,updateSingleCart
  };
  