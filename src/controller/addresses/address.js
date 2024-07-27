const {
  ReasonPhrases,
  StatusCodes,
  getReasonPhrase,
  getStatusCode,
} = require("http-status-codes");
const { FilterOptions } = require("../../utils/helper");
const Address = require("../../models/address");

const create = async (req, res) => {
  try {
    const newAddress = await Address.create(req.body);
    res.status(201).json({
      statusCode: 201,
      status: "Created",
      results: newAddress,
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      status: "Internal Server Error",
      error: error.message,
    });
  }
};

const get = async (req, res) => {
  const { limit, page, filter, sort } = req.query;
  try {
    const filterquery = FilterOptions(sort, page, limit, filter);
    const Addresses = await Address.find(
      filterquery.query,
      "-__v",
      filterquery.options
    );
    const length = await Address.countDocuments(filterquery.query);
    res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      status: ReasonPhrases.OK,
      total: length,
      results: Addresses,
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      status: "Internal Server Error",
      error: error.message,
    });
  }
};

const getSingle = async (req, res) => {
  try {
    const Address = await Address.findById(req.params.id);
    if (!Address) {
      return res.status(404).json({
        statusCode: 404,
        status: "Not Found",
        error: "User address not found",
      });
    }
    res.status(200).json({
      statusCode: 200,
      status: "OK",
      results: Address,
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      status: "Internal Server Error",
      error: error.message,
    });
  }
};
const update = async (req, res) => {
  try {
    const updatedAddress = await Address.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedAddress) {
      return res.status(404).json({
        statusCode: 404,
        status: "Not Found",
        error: "User address not found",
      });
    }
    res.status(200).json({
      statusCode: 200,
      status: "OK",
      results: updatedAddress,
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      status: "Internal Server Error",
      error: error.message,
    });
  }
};
const remove = async (req, res) => {
  try {
    const deletedAddress = await Address.findByIdAndDelete(
      req.params.id
    );
    if (!deletedAddress) {
      return res.status(404).json({
        statusCode: 404,
        status: "Not Found",
        error: "User address not found",
      });
    }
    res.status(200).json({
      statusCode: 200,
      status: "OK",
      results: deletedAddress,
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      status: "Internal Server Error",
      error: error.message,
    });
  }
};

const addAddress = async (req, res) => {
  try {
    const deletedAddress = await Address.findByIdAndUpdate(
      req.params.id
    );
    if (!deletedAddress) {
      return res.status(404).json({
        statusCode: 404,
        status: "Not Found",
        error: "User address not found",
      });
    }
    res.status(200).json({
      statusCode: 200,
      status: "OK",
      results: deletedAddress,
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      status: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  create,
  get,
  getSingle,
  update,
  remove,
  addAddress,
};
