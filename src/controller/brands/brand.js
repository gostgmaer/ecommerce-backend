const {
    ReasonPhrases,
    StatusCodes,
    getReasonPhrase,
    getStatusCode,
  } = require("http-status-codes");
  const { FilterOptions } = require("../../utils/helper");
  const Brand = require("../../models/brands");
  
  const create = async (req, res) => {
    try {
      const brand = new Brand(req.body);
      const response = await brand.save();
      res.status(201).json({
        statusCode: 201,
        status: "Created",
        results: { id: response.id },
        message: "Brand created success",
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
  
  const get = async (req, res) => {
    const { limit, page, filter, sort } = req.query;
  
    try {
      const filterquery = FilterOptions(sort, page||1, limit||10, filter);
      const responseData = await Brand.find( filterquery.query,
        "-__v",
        filterquery.options);
  
        const count = await Promise.all(
          responseData.map(async (item) => {
            const total = await item.getProductCount('publish');
            return { ...item._doc, total };
          })
        );
  
      const length = await Brand.countDocuments(filterquery.query);
  
      res.status(200).json({
        statusCode: 200,
        status: "OK",
        message: " retrieved successfully",
        results: responseData ? count : [],
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
  
  const getSingle = async (req, res) => {
    try {
      const responseData = await Brand.findById(req.params.id);
      if (!responseData) {
        return res.status(404).json({
          statusCode: 404,
          status: "Not Found",
          results: null,
          message: "Brand not found",
        });
      } else {
        const total = await responseData.getProductCount('publish');
        res.status(200).json({
          statusCode: 200,
          status: "OK",
          results: {...responseData["_doc"],total},
          message: " retrieved successfully",
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
  const update= async (req, res) => {
    try {
      const response = await Brand.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!update) {
        return res.status(404).json({
          statusCode: 404,
          status: "Not Found",
          results: null,
          message: "Brand not found",
        });
      }
      res.status(200).json({
        statusCode: 200,
        status: "OK",
        results: response,
        message: "updated successfully",
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
  const remove = async (req, res) => {
    try {
      const response = await Brand.findByIdAndUpdate(req.params.id, {status:"INACTIVE"}, {
        new: true,
      });
      if (!response) {
        return res.status(404).json({
          statusCode: 404,
          status: "Not Found",
          results: null,
          message: "data not found",
        });
      } else {
        res.status(200).json({
          statusCode: 200,
          status: "OK",
          message: " deleted successfully",
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
  
  const itemsPerBrands = async (req, res) => {
  
    try {
      const categories = await Brand.find();
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
        message: " retrieved successfully",
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
    get,
    getSingle,
    update,
    remove,
    itemsPerBrands,
  };
  