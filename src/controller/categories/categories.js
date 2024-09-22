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
      "-__v -cat_id -child -parent_category",
      filterquery.options);

      const categoryCounts = await Promise.all(
        responseData.map(async (category) => {
          const total = await category.getProductCount('publish');
          return { ...category._doc, total };
        })
      );

    const length = await Category.countDocuments(filterquery.query);

    res.status(200).json({
      statusCode: 200,
      status: "OK",
      message: "Categorys retrieved successfully",
      results: responseData ? categoryCounts : [],
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

const itemsPerCategory = async (req, res) => {

  try {
    const categories = await Category.find();
    // Iterate over each category and get the product count
    const categoryCounts = await Promise.all(
      categories.map(async (category) => {
        const productCount = await category.getProductCount('publish');
        return { ...category._doc, productCount };
      })
    );

    res.status(200).json({
      statusCode: 200,
      status: "OK",
      results: categoryCounts,
      message: "Category retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      status: "Internal Server Error",
      message: error.message,
    });
  }
};

//Public

const getShowingCategory = async (req, res) => {
  const { limit, page, filter, sort } = req.query;

  try {
    const filterquery = FilterOptions(sort, page, limit, filter);

    const responseData = await Category.find( {status:'publish'},
      "-__v -cat_id",
      filterquery.options).populate('child','title slug images descriptions').populate('parent','title slug images descriptions')



    const length = await Category.countDocuments({status:'publish'});

    res.status(200).json({
      statusCode: 200,
      status: "OK",
      message: "Categorys retrieved successfully",
      results: responseData,
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


module.exports = {
  createCategory,
  getCategories,
  getSingleCategorys,
  updateCategory,
  deleteCategorys,
  itemsPerCategory,getShowingCategory
};
