// const { ReasonPhrases, StatusCodes } = require("http-status-codes");
const { FilterOptions,showingProductFilter } = require("../../utils/helper");
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


const createProductBulk = async (req, res) => {
  try {
    const savedProducts = await Product.insertMany(req.body);
    res.status(201).json({
      statusCode: 201,
      status: "Created",
      results: savedProducts,
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
      .populate("reviews")
      .populate("brand")
      .populate("categories",'_id title slug').populate("category",'_id title slug');
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
   const { limit, page, category,_id,sort,query } = req.query;

  try {
    const filterquery = await showingProductFilter(sort, page,limit, category,_id,query);
    const products = await Product.find(
      filterquery.query,
      "-__v -categories -barcode -createdAt -tag -features -isFeatured -productId -productType -reviews -seo_info -status -total_view -updatedAt -gtin -description",
      filterquery.options
    ).populate("reviews")
      .populate("brand")
      .populate("categories",'title slug').populate("category",'title slug');
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
  const q = req.query;
  // const query = JSON.parse(q)

  try {
    var product;
    if (Object.keys(q).length != 0) {
      product = await Product.findOne(q)
        .populate("reviews",'_id title slug')
        .populate("categories",'_id title slug');
    } else {
      product = await Product.findById(req.params.id)
        .populate("reviews",'_id title slug')
        .populate("categories",'_id title slug');
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
  const { slug, id, sku, unid } = req.query;

  try {
    let product;

    // Determine query parameter and fetch product based on that
    if (slug) {
      product = await Product.findOne({ slug })
        .populate("reviews")
        .populate("categories",'_id title slug').populate("category",'_id title slug')
        .populate("brand");
    } else if (id) {
      product = await Product.findById(id)
        .populate("reviews")
        .populate("categories",'_id title slug').populate("category",'_id title slug')
        .populate("brand");
    } else if (sku) {
      product = await Product.findOne({ sku })
        .populate("reviews")
        .populate("categories",'_id title slug').populate("category",'_id title slug')
        .populate("brand");
    } else if (unid) {
      product = await Product.findOne({ unid })
        .populate("reviews")
        .populate("categories",'_id title slug').populate("category",'_id title slug')
        .populate("brand");
    } else {
      const defaultSlug = req.params.slug; // Assuming you pass the slug via params
      // product = await Product.findOne({ slug: defaultSlug })
      //   .populate("reviews")
      //   .populate("categories")
      //   .populate("brand");

      product = await Product.findOneAndUpdate(
        { slug: defaultSlug },
        { $inc: { total_view: 1 } }, // Increment total_view by 1
        { new: true } // Return the updated document
      ).populate("reviews")
        .populate("categories",'_id title slug')
        .populate("category",'_id title slug')
        .populate("brand");

      // If no slug is passed in params and no product is found, return a bad request
      if (!defaultSlug) {
        return res.status(400).json({
          statusCode: 400,
          status: "Bad Request",
          results: null,
          message: "No query parameters provided and no default slug found.",
        });
      }
    }

    if (!product) {
      return res.status(404).json({
        statusCode: 404,
        status: "Not Found",
        results: null,
        message: "Product not found",
      });
    }

    // await Product.updateOne({ _id: product._id }, { $inc: { total_view: 1 } });
    const currentProd = { ...product["_doc"], ...product.ratingStatistics };

 

    return res.status(200).json({
      statusCode: 200,
      status: "OK",
      results: currentProd,
      message: "Product retrieved successfully",
    });
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      status: "Internal Server Error",
      results: null,
      message: error.message,
    });
  }
};
const getRelatedProducts = async (req, res) => {
  const { category } = req.query;

  try {
    // const filterquery = FilterOptions(sort, page, limit, filter);
    const products = await Product.find(
      { category: category },
      "-__v -categories -barcode -createdAt -tag -features -isFeatured -productId -productType -reviews -seo_info -status -total_view -updatedAt -gtin -description",
    ).populate("reviews")
      .populate("brand")
      .populate("categories",'_id title slug')
      .populate("category",'_id title slug');
    const length = await Product.countDocuments({ category: category });

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

const getPopularProducts = async (req, res) => {


  const filter = { total_view: { $gt: 0 } };

  try {
    // const filterquery = FilterOptions(sort, page, limit, filter);
    const products = await Product.find(
      filter,
      "-__v -categories -barcode -createdAt -tag -features -isFeatured -productId -productType -reviews -seo_info -status -total_view -updatedAt -gtin -description",
    ).populate("reviews")
      .populate("brand")
      .populate("categories",'_id title slug')
      .populate("category",'_id title slug').sort({ total_view: -1 });
    const length = await Product.countDocuments(filter);

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

const getDiscountedProducts = async (req, res) => {
  
  const filter = { discount: { $gt: 0 } };

  try {
    // const filterquery = FilterOptions(sort, page, limit, filter);
    const products = await Product.find(
      filter,
      "-__v -categories -barcode -createdAt -tag -features -isFeatured -productId -productType -reviews -seo_info -status -total_view -updatedAt -gtin -description",
    ).populate("reviews")
      .populate("brand")
      .populate("categories",'_id title slug')
      .populate("category",'_id title slug').sort({ discount: -1 });

    const length = await Product.countDocuments(filter);

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
  getproductReviews,
  getCurrentProducts,
  getCurrentSingle, getRelatedProducts, getDiscountedProducts, getPopularProducts,createProductBulk
};
