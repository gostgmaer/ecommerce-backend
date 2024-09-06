const {
  ReasonPhrases,
  StatusCodes,
  getReasonPhrase,
  getStatusCode,
} = require("http-status-codes");
const { FilterOptions } = require("../../utils/helper");
const Product = require("../../models/products");

const createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    const savedProduct = await product.save();
    res.status(201).json({
      statusCode: 201,
      status: "Created",
      results: savedProduct,
      message: "Product created successfully",
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

const getProducts = async (req, res) => {
  const { limit, page, filter, sort } = req.query;

  try {
    const filterquery = FilterOptions(sort, page, limit, filter);
    const products = await Product.find(
      filterquery.query,
      "-__v", 
      filterquery.options
    )
      .populate("reviews").populate("brandName")
      .populate("categories");
    const length = await Product.countDocuments(filterquery.query);

    if (products) {
      const currentProd = products.map((product) => {
        const ratingStatistics = product.ratingStatistics;
        return {
          ...product["_doc"],
          ...ratingStatistics,
        };
      });

      res.status(200).json({
        statusCode: 200,
        status: "OK",
        results: currentProd,
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

const getCurrentProducts = async (req, res) => {

  const { limit, page, filter, sort,query } = req.query;

  try {
    const filterquery = FilterOptions(sort, page, limit, filter);
    const products = await Product.find(
      filterquery.query,
      "-__v", 
      filterquery.options
    )
      .populate("reviews").populate("brandName")
      .populate("categories");
    const length = await Product.countDocuments(filterquery.query);

    if (products) {
      const currentProd = products.map((product) => {
        const ratingStatistics = product.ratingStatistics;
        return {
          ...product["_doc"],
          ...ratingStatistics,
        };
      });

      res.status(200).json({
        statusCode: 200,
        status: "OK",
        results: currentProd,
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



const getSingleProducts = async (req, res) => {
  const params = req.params;
  const q = req.query;
  // const query = JSON.parse(q)

  try {
    var product;
    if (Object.keys(q).length != 0) {
      product = await Product.findOne(q)
        .populate("reviews")
        .populate("categories");
    } else {
      product = await Product.findById(req.params.id)
        .populate("reviews")
        .populate("categories");
    }

    if (!product) {
      return res.status(404).json({
        statusCode: 404,
        status: "Not Found",
        results: null,
        message: "Product not found",
      });
    }

    const currentProd = { ...product["_doc"], ...product.ratingStatistics };

    res.status(200).json({
      statusCode: 200,
      status: "OK",
      results: currentProd,
      message: "Product retrieved successfully",
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

const getCurrentSingle = async (req, res) => {
  const params = req.params;
  const q = req.query;
  // const query = JSON.parse(q)

  try {
    var product;
    if (Object.keys(q).length != 0) {
      product = await Product.findOne(q)
        .populate("reviews")
        .populate("categories");
    } else {
      product = await Product.findById(req.params.id)
        .populate("reviews")
        .populate("categories");
    }

    if (!product) {
      return res.status(404).json({
        statusCode: 404,
        status: "Not Found",
        results: null,
        message: "Product not found",
      });
    }

    const currentProd = { ...product["_doc"], ...product.ratingStatistics };

    res.status(200).json({
      statusCode: 200,
      status: "OK",
      results: currentProd,
      message: "Product retrieved successfully",
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

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!product) {
      return res.status(404).json({
        statusCode: 404,
        status: "Not Found",
        results: null,
        message: "Product not found",
      });
    }
    res.status(200).json({
      statusCode: 200,
      status: "OK",
      results: product,
      message: "Product updated successfully",
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
const deleteProducts = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { status: "INACTIVE" },
      {
        new: true,
      }
    );
    if (!product) {
      return res.status(404).json({
        statusCode: 404,
        status: "Not Found",
        message: "Product not found",
      });
    }
    res.status(200).json({
      statusCode: 200,
      status: "OK",
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      status: "Internal Server Error",
      message: error.message,
    });
  }
};

const getproductReviews = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        statusCode: 404,
        status: "Not Found",
        results: null,
        message: "Product not found",
      });
    }

    const reviews = product.ratings;
    res.status(200).json({
      statusCode: 200,
      status: "OK",
      results: reviews,
      message: "Reviews for the product retrieved successfully",
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
  createProduct,
  getProducts,
  getSingleProducts,
  updateProduct,
  deleteProducts,
  getproductReviews,getCurrentProducts,getCurrentSingle
};
