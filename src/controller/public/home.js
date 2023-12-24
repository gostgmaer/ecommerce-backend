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
const Brand = require("../../models/brands");

const gethomeDetails = async (req, res) => {
  const { limit, page, filter, sort } = req.query;
  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 30);

  try {
    const filterquery = FilterOptions(sort, page, limit, filter);
    const featured = await Product.find(
      { isFeatured: true, status: "publish" },
      "-status -productUPCEAN -manufacturerPartNumber -gtin -createdAt -updatedAt -__v -seo_info",
      filterquery.options
    )
      .populate("reviews")
      .populate("categories");

    const currentfeatured = featured.map((product) => {
      const ratingStatistics = product.ratingStatistics;
      const simplifiedImages = product.getSimplifiedImages();
      return {
        ...product["_doc"],images:simplifiedImages,
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
      "-status -productUPCEAN -manufacturerPartNumber -isFeatured -gtin -createdAt -updatedAt -__v -seo_info",
      filterquery.options
    )
      .populate("reviews")
      .populate("categories");

    const currentflash = flashDeal.map((product) => {
      const ratingStatistics = product.ratingStatistics;
      const simplifiedImages = product.getSimplifiedImages();
      return {
        ...product["_doc"],images:simplifiedImages,
        ...ratingStatistics,
      };
    });

    const newArive = await Product.find(
      { createdAt: { $gte: sevenDaysAgo }, status: "publish" },
      "-status -productUPCEAN -manufacturerPartNumber -isFeatured -gtin -createdAt -updatedAt -seo_info",
      filterquery.options
    )
      .populate("reviews")
      .populate("categories");

    const currentnewArive = newArive.map((product) => {
      const ratingStatistics = product.ratingStatistics;
      const simplifiedImages = product.getSimplifiedImages();
      return {
        ...product["_doc"],images:simplifiedImages,
        ...ratingStatistics,
      };
    });




    const cate = await Category.find({ status: { $ne: "INACTIVE" } } , "images name slug");
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
    const singleProduct = await Product.findOne(q,  "-status -productUPCEAN -manufacturerPartNumber -gtin -createdAt -updatedAt -__v",)
      .populate("reviews")
      .populate("categories").populate("brandName");

    const currentProd = {
      ...singleProduct["_doc"],
      ...singleProduct.ratingStatistics,
    };

    const related = await Product.find(
      { categories: singleProduct["categories"] },
      "-status -productUPCEAN -manufacturerPartNumber -gtin -createdAt -updatedAt -__v",
    )
      .populate("reviews")
      .populate("categories").populate("brandName");

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
    const products = await Product.find(filterquery.query, "-status -seo_info -productUPCEAN -manufacturerPartNumber -gtin -createdAt -updatedAt -__v", {
      ...filterquery.options,
    })
      .populate("reviews")
      .populate("categories");
    const length = await Product.countDocuments(filterquery.query);


    if (products) {
      const currentProd = products.map((product) => {
        const ratingStatistics = product.ratingStatistics;
        var cate = []

        product.categories.forEach(element => {
          cate.push({name:element.name,slug:element.slug,_id:element._id})
        });
        const simplifiedImages = product.getSimplifiedImages();
        // const reviewImage = product.reviews.getSimplifiedImages();

        return {
          ...product._doc,images:simplifiedImages,
          ...ratingStatistics,categories:cate
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
