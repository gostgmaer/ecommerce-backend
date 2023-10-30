const {
  ReasonPhrases,
  StatusCodes,
  getReasonPhrase,
  getStatusCode,
} = require("http-status-codes");
const { FilterOptions } = require("../../utils/helper");
const Wishlist = require("../../models/wishlist/wishlist");

const createWishlist = async (req, res) => {
  try {
    const Wishlist = new Wishlist(req.body);
    const savedWishlist = await Wishlist.save();
    res.status(201).json({
      statusCode: 201,
      status: "Created",
      results: { id: savedWishlist.id },
      message: "Wishlist created",
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

const getWishlists = async (req, res) => {
  try {
    const Wishlists = await Wishlist.find();
    const length = await Wishlist.countDocuments();

    res.status(200).json({
      statusCode: 200,
      status: "OK",
      message: "Wishlists retrieved successfully",
      results: Wishlists,
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

const getSingleWishlists = async (req, res) => {
  try {
    const Wishlist = await Wishlist.findById(req.params.id);
    if (!Wishlist) {
      return res.status(404).json({
        statusCode: 404,
        status: "Not Found",
        results: null,
        message: "Wishlist not found",
      });
    }
    res.status(200).json({
      statusCode: 200,
      status: "OK",
      results: Wishlist,
      message: "Wishlist retrieved successfully",
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
const updateWishlist = async (req, res) => {
  try {
    const Wishlist = await Wishlist.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!Wishlist) {
      return res.status(404).json({
        statusCode: 404,
        status: "Not Found",
        results: null,
        message: "Wishlist not found",
      });
    }
    res.status(200).json({
      statusCode: 200,
      status: "OK",
      results: Wishlist,
      message: "Wishlist updated successfully",
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
const deleteWishlists = async (req, res) => {
  try {
    const Wishlist = await Wishlist.findByIdAndDelete(req.params.id);
    if (!Wishlist) {
      return res.status(404).json({
        statusCode: 404,
        status: "Not Found",
        results: null,
        message: "Wishlist not found",
      });
    }
    res.status(200).json({
      statusCode: 200,
      status: "OK",
      results: null,
      message: "Wishlist deleted successfully",
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

module.exports = {
  createWishlist,
  getWishlists,
  getSingleWishlists,
  updateWishlist,
  deleteWishlists,
};
