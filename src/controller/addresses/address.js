const {
  ReasonPhrases,
  StatusCodes,
  getReasonPhrase,
  getStatusCode,
} = require("http-status-codes");
const { FilterOptions } = require("../../utils/helper");
const UserAddress = require("../../models/address");

const create = async (req, res) => {
  try {
    const newUserAddress = await UserAddress.create(req.body);
    res.status(201).json({
      statusCode: 201,
      status: 'Created',
      results: newUserAddress,
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      status: 'Internal Server Error',
      error: error.message,
    });
  }
};

const get = async (req, res) => {
  try {
    const userAddresses = await UserAddress.find();
    res.status(200).json({
      statusCode: 200,
      status: 'OK',
      results: userAddresses,
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      status: 'Internal Server Error',
      error: error.message,
    });
  }
};

const getSingle = async (req, res) => {
  try {
    const userAddress = await UserAddress.findById(req.params.id);
    if (!userAddress) {
      return res.status(404).json({
        statusCode: 404,
        status: 'Not Found',
        error: 'User address not found',
      });
    }
    res.status(200).json({
      statusCode: 200,
      status: 'OK',
      results: userAddress,
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      status: 'Internal Server Error',
      error: error.message,
    });
  }
};
const update= async (req, res) => {
  try {
    const updatedUserAddress = await UserAddress.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedUserAddress) {
      return res.status(404).json({
        statusCode: 404,
        status: 'Not Found',
        error: 'User address not found',
      });
    }
    res.status(200).json({
      statusCode: 200,
      status: 'OK',
      results: updatedUserAddress,
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      status: 'Internal Server Error',
      error: error.message,
    });
  }
};
const remove = async (req, res) => {
  try {
    const deletedUserAddress = await UserAddress.findByIdAndRemove(req.params.id);
    if (!deletedUserAddress) {
      return res.status(404).json({
        statusCode: 404,
        status: 'Not Found',
        error: 'User address not found',
      });
    }
    res.status(200).json({
      statusCode: 200,
      status: 'OK',
      results: deletedUserAddress,
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      status: 'Internal Server Error',
      error: error.message,
    });
  }
};

const addAddress = async (req, res) => {
  try {
    const deletedUserAddress = await UserAddress.findByIdAndUpdate(req.params.id);
    if (!deletedUserAddress) {
      return res.status(404).json({
        statusCode: 404,
        status: 'Not Found',
        error: 'User address not found',
      });
    }
    res.status(200).json({
      statusCode: 200,
      status: 'OK',
      results: deletedUserAddress,
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      status: 'Internal Server Error',
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
