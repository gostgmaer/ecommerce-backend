const {
  ReasonPhrases,
  StatusCodes,
  getReasonPhrase,
  getStatusCode,
} = require("http-status-codes");
const { FilterOptions } = require("../../utils/helper");
const Review = require("../../models/reviews");

const create = async (req, res) => {
  try {
    const review = new Review(req.body);
    const saveReview = await review.save();
    res.status(201).json({
      statusCode: 201,
      status: "Created",
      results: saveReview,
      message: "created successfully",
    });
  } catch (error) {
    res.status(400).json({
      statusCode: 400,
      status: "Bad Request",
      message: error.message,
    });
  }
};

const getAll = async (req, res) => {
  const { limit, page, filter, sort } = req.query;

  try {
    const filterquery = FilterOptions(sort, page, limit, filter);
    const data = await Review.find(
      filterquery.query,
      "-__v",
      filterquery.options
    );
    const length = await Review.countDocuments(filterquery.query);

    if (data) {
      res.status(200).json({
        statusCode: 200,
        status: "OK",
        results: data,
        total: length,
        message: "Products retrieved successfully",
      });
    }
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      status: "Internal Server Error",
      results: null,
      message: error.message,
    });
  }
};

const getSingle = async (req, res) => {
  try {
    var reviewData = await Review.findById(req.params.id);

    if (!reviewData) {
      return res.status(404).json({
        statusCode: 404,
        status: "Not Found",
        results: null,
        message: "Review not found",
      });
    } else {
      res.status(200).json({
        statusCode: 200,
        status: "OK",
        results: reviewData,
        message: "Review get successfully",
      });
    }
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      status: "Internal Server Error",
      results: null,
      message: error.message,
    });
  }
};
const updateData = async (req, res) => {
  try {
    const reviewData = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!reviewData) {
      return res.status(404).json({
        statusCode: 404,
        status: "Not Found",
        message: "review not found",
      });
    }
    res.status(200).json({
      statusCode: 200,
      status: "OK",
      results: reviewData,
      message: "updated successfully",
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
const deleteData = async (req, res) => {
  try {
    const reviewData = await Review.findByIdAndUpdate(
      req.params.id,
      { status: "INACTIVE" },
      {
        new: true,
      }
    );
    if (!reviewData) {
      return res.status(404).json({
        statusCode: 404,
        message: " not found",
      });
    }
    res.status(200).json({
      statusCode: 200,
      status: "OK",
      message: " deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      status: "Internal Server Error",
      message: error.message,
    });
  }
};

module.exports = {
  create,
  getAll,
  getSingle,
  updateData,
  deleteData,
};
