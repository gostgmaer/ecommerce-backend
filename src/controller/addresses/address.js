const {
  ReasonPhrases,
  StatusCodes
} = require("http-status-codes");
const { FilterOptions } = require("../../utils/helper");
const Address = require("../../models/address");
const User = require("../../models/user");
const create = async (req, res) => {
  try {
    const address = new Address(req.body);
    const savedAddress = await address.save();
    var myquery = { _id: savedAddress.user };
    const user = await User.findById(myquery);
    user.address.push(savedAddress._id);
    await user.save();
    
    return res.status(200).json({
      statusCode: 200,
      status: ReasonPhrases.OK,
      message: "User address is add successfully",
    });


  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      status: "Internal Server Error",
      message: error.message,
    });
  }
};

const get = async (req, res) => {
  const { limit, page, filter, sort } = req.query;
  try {
    const filterquery = FilterOptions(sort, page||1, limit||10, filter);
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
      message: error.message,
    });
  }
};

const getSingle = async (req, res) => {
  try {
    const response = await Address.findById(req.params.id);
    if (!response) {
      return res.status(404).json({
        statusCode: 404,
        status: "Not Found",
        message: "User address not found",
      });
    }
    res.status(200).json({
      statusCode: 200,
      status: "OK",
      results: response,
      message: "User address found",
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      status: "Internal Server Error",
      message: error.message,
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
        message: "address not found",
      });
    }
    res.status(200).json({
      statusCode: 200,
      status: "OK",
      message: "Address Update Successfully!",
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      status: "Internal Server Error",
      message: error.message,
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
        message: "address not found",
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
      message: error.message,
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
        message: "User address not found",
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
  addAddress,
};
