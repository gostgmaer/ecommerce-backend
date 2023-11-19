const {
  ReasonPhrases,
  StatusCodes,
  getReasonPhrase,
  getStatusCode,
} = require("http-status-codes");
const { FilterOptions } = require("../../utils/helper");
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
    );
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
    );
    const newArive = await Product.find(
      { createdAt: { $gte: sevenDaysAgo }, status: "publish" },
      "-__v",
      filterquery.options
    );

    const products = await Product.find(
      filterquery.query,
      "-__v",
      filterquery.options
    );
    const categories = await Category.find({ status: "publish" }, "-__v");

    res.status(200).json({
      statusCode: 200,
      status: "OK",
      results: { featured, flashDeal, newArive, categories },
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
    const singleProduct = await Product.findOne(q).populate("reviews");

    const related = await Product.find(
      { categories: singleProduct["categories"] },
      "-__v"
    );

    if (singleProduct) {
      res.status(200).json({
        statusCode: 200,
        status: "OK",
        results: { singleProduct, related },
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

module.exports = {
  gethomeDetails,
  getSingleProductDetails,
};
