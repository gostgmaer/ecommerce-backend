const {
  ReasonPhrases,
  StatusCodes,
  getReasonPhrase,
  getStatusCode,
} = require("http-status-codes");
const { FilterOptions, FilterOptionsSearch } = require("../../utils/helper");
const Product = require("../../models/products");
const Category = require("../../models/categories");
const Review = require("../../models/reviews");

const gethomeDetails = async (req, res) => {
  const { limit, page, filter, sort } = req.query;
  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 30);

  try {
    const filterquery = FilterOptions(sort, page, limit, filter);
    const featured = await Product.find(
      { isFeatured: true, status: "publish" },
      "-__v",
      filterquery.options
    )
      .populate("reviews")
      .populate("categories");

    const currentfeatured = featured.map((product) => {
      const ratingStatistics = product.ratingStatistics;
      return {
        ...product["_doc"],
        ...ratingStatistics,
      };
    });

    const flashDeal = await Product.find(
      {
        $expr: {
          $gte: [
            {
              $multiply: [
                {
                  $subtract: ["$price", "$salePrice"],
                },
                100,
              ],
            },
            30, // 30% threshold
          ],
        },
        status: "publish",
      },
      "-__v",
      filterquery.options
    )
      .populate("reviews")
      .populate("categories");

    const currentflash = flashDeal.map((product) => {
      const ratingStatistics = product.ratingStatistics;
      return {
        ...product["_doc"],
        ...ratingStatistics,
      };
    });

    const newArive = await Product.find(
      { createdAt: { $gte: sevenDaysAgo }, status: "publish" },
      "-__v",
      filterquery.options
    )
      .populate("reviews")
      .populate("categories");

    const currentnewArive = newArive.map((product) => {
      const ratingStatistics = product.ratingStatistics;
      return {
        ...product["_doc"],
        ...ratingStatistics,
      };
    });

    const products = await Product.find(
      filterquery.query,
      "-__v",
      filterquery.options
    );

    const currentall = products.map((product) => {
      const ratingStatistics = product.ratingStatistics;
      return {
        ...product["_doc"],
        ...ratingStatistics,
      };
    });

    const cate = await Category.find({ status: { $ne: "INACTIVE" } });
    // Iterate over each category and get the product count
    const categories = await Promise.all(
      cate.map(async (category) => {
        const productCount = await category.getProductCount("publish");
        return { ...category._doc, productCount };
      })
    );

    res.status(200).json({
      statusCode: 200,
      status: "OK",
      results: {
        featured: currentfeatured,
        flashDeal: currentflash,
        newArive: currentnewArive,
        categories,
      },
      message: "Products retrieved successfully",
    });

    if (products) {
      const currentProd = products.map((product) => {
        const ratingStatistics = product.ratingStatistics;
        return {
          ...product["_doc"],
          ...ratingStatistics,
        };
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

const getSingleProductDetails = async (req, res) => {
  const { limit, page, filter, sort } = req.query;
  const q = req.query;

  try {
    const singleProduct = await Product.findOne(q)
      .populate("reviews")
      .populate("categories");

    const currentProd = {
      ...singleProduct["_doc"],
      ...singleProduct.ratingStatistics,
    };

    const related = await Product.find(
      { categories: singleProduct["categories"] },
      "-__v"
    )
      .populate("reviews")
      .populate("categories");

    if (singleProduct) {
      res.status(200).json({
        statusCode: 200,
        status: "OK",
        results: { currentProd, related },
        message: "retrieved successfully",
      });
    }
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      status: "Internal Server Error",
      message: error.message,
    });
  }
};

const getProductsSearch = async (req, res) => {
  const { limit, page, filter, sort } = req.query;

  var sortObj = {};

  try {
    const filterquery = FilterOptionsSearch(sort, page, limit, filter);
    const products = await Product.find(filterquery.query, "-__v", {
      ...filterquery.options,
    })
      .populate("reviews")
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

module.exports = {
  gethomeDetails,
  getSingleProductDetails,
  getProductsSearch,
};
