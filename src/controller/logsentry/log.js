const {
  ReasonPhrases,
  StatusCodes,
  getReasonPhrase,
  getStatusCode,
} = require("http-status-codes");
const { FilterOptions } = require("../../utils/helper");
const LogEntry = require("../../models/logEntry");

const getAllLogs = async (req, res) => {
  const { limit, page, filter, sort } = req.query;

  try {
    const filterquery = FilterOptions(sort, page, limit, filter);
    const responseData = await LogEntry.find(
      filterquery.query,
      "-__v",
      filterquery.options
    );
    const length = await LogEntry.countDocuments(filterquery.query);

    res.status(200).json({
      statusCode: 200,
      status: "OK",
      message: "Carts retrieved successfully",
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

const getSingleLogs = async (req, res) => {
  try {
    const singleData = await LogEntry.findById(req.params.id);
    if (!singleData) {
      return res.status(404).json({
        statusCode: 404,
        status: "Not Found",
        results: null,
        message: "Logs not found",
      });
    }
    res.status(200).json({
      statusCode: 200,
      status: "OK",
      results: singleData,
      message: "Log retrieved successfully",
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
const updateLogs = async (req, res) => {
  try {
    const data = await LogEntry.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!data) {
      return res.status(404).json({
        statusCode: 404,
        status: "Not Found",
        results: null,
        message: "Log not found",
      });
    }
    res.status(200).json({
      statusCode: 200,
      status: "OK",
      results: data,
      message: "Log updated successfully",
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
const deleteLogs = async (req, res) => {
  try {
    const currData = await Cart.findByIdAndDelete(req.params.id);
    if (!currData) {
      return res.status(404).json({
        statusCode: 404,
        status: "Not Found",
        results: null,
        message: "log not found",
      });
    }
    res.status(200).json({
      statusCode: 200,
      status: "OK",
      message: "deleted successfully",
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
  getAllLogs,
  getSingleLogs,
  updateLogs,
  deleteLogs,
};
