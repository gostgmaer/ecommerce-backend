const {
  ReasonPhrases,
  StatusCodes,
  getReasonPhrase,
  getStatusCode,
} = require("http-status-codes");
const { FilterOptions } = require("../../utils/helper");
const Category = require("../../models/categories");

const createCategory = async (req, res) => {
  try {
    const category = new Category(req.body);
    const savedCategory = await category.save();
    res.status(201).json({
      statusCode: 201,
      status: "Created",
      results: { id: savedCategory.id },
      message: "Category created",
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

const getCategories = async (req, res) => {
  const { limit, page, filter, sort } = req.query;

  try {
    const filterquery = FilterOptions(sort, page, limit, filter);
    const responseData = await Category.find( filterquery.query,
      "-__v",
      filterquery.options);
    const length = await Category.countDocuments(filterquery.query);

    res.status(200).json({
      statusCode: 200,
      status: "OK",
      message: "Categorys retrieved successfully",
      results: responseData ? responseData : [],
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

const getSingleCategorys = async (req, res) => {
  try {
    const responseData = await Category.findById(req.params.id);
    if (!responseData) {
      return res.status(404).json({
        statusCode: 404,
        status: "Not Found",
        results: null,
        message: "Category not found",
      });
    } else {
      res.status(200).json({
        statusCode: 200,
        status: "OK",
        results: responseData,
        message: "Category retrieved successfully",
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
const updateCategory = async (req, res) => {
  try {
    const update = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!update) {
      return res.status(404).json({
        statusCode: 404,
        status: "Not Found",
        results: null,
        message: "Category not found",
      });
    }
    res.status(200).json({
      statusCode: 200,
      status: "OK",
      results: update,
      message: "Category updated successfully",
    });
  } catch (error) {
    res.status(400).json({
      statusCode: 500,
      status: "Internal Server Error",
      results: null,
      message: error.message,
    });
  }
};
const deleteCategorys = async (req, res) => {
  try {
    const response = await Category.findByIdAndUpdate(req.params.id, {status:"INACTIVE"}, {
      new: true,
    });
    if (!response) {
      return res.status(404).json({
        statusCode: 404,
        status: "Not Found",
        results: null,
        message: "Category not found",
      });
    } else {
      res.status(200).json({
        statusCode: 200,
        status: "OK",
        message: "Category deleted successfully",
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

const getCategoryReviews = async (req, res) => {
  try {
    const Category = await Category.findById(req.params.id);
    if (!Category) {
      return res.status(404).json({
        statusCode: 404,
        status: "Not Found",
        results: null,
        message: "Category not found",
      });
    }

    const reviews = Category.ratings;
    res.status(200).json({
      statusCode: 200,
      status: "OK",
      results: reviews,
      message: "Reviews for the Category retrieved successfully",
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
  createCategory,
  getCategories,
  getSingleCategorys,
  updateCategory,
  deleteCategorys,
  getCategoryReviews,
};
