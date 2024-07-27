const {
  ReasonPhrases,
  StatusCodes,
  getReasonPhrase,
  getStatusCode,
} = require("http-status-codes");
const { FilterOptions } = require("../../utils/helper");
const Wishlist = require("../../models/wishlist");

const createWishlist = async (req, res) => {
  const { product } = req.body;
  try {
    const wishlists = await Wishlist.findOne({ user: req.params.user });
    if (wishlists) {
      wishlists.products.push(product); // Assuming product field contains a product ID
      await wishlists.save();
      res.status(200).json({
        statusCode: 200,
        status: "OK",
        message: "Add Successful",
      });
    } else {
      const wishlist = new Wishlist({
        user: req.params.user,
        products: product // Assuming products field contains an array of product IDs
      });
      const savedWishlist = await wishlist.save();
      res.status(201).json({
        statusCode: 201,
        status: "Created",
        result: { id: savedWishlist.id },
        message: "Wishlist created",
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


const addProduct = async (req, res) => {

  try {
    const wishlist = await Wishlist.findById(req.params.id);
    if (!wishlist) {
      return res.status(404).json({
        message: 'Wishlist not found', statusCode: StatusCodes.NOT_FOUND,
        status: ReasonPhrases.NOT_FOUND
      });
    }
    // Add product to the wishlist
    wishlist.products.push(req.body.product); // Assuming product field contains a product ID
    await wishlist.save();

    res.status(200).json({
      statusCode: 200,
      status: "OK",
      message: "Add Successful",
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      status: "Internal Server Error",
      message: error.message,
    });
  }
}

const removeProduct = async (req, res) => {

  try {
    const wishlist = await Wishlist.findById(req.params.id);
    if (!wishlist) {
      return res.status(404).json({
        message: 'Wishlist not found', statusCode: StatusCodes.NOT_FOUND,
        status: ReasonPhrases.NOT_FOUND
      });
    }
    // Add product to the wishlist
    wishlist.products.pull(req.body.product); // Assuming product field contains a product ID
    await wishlist.save();
    res.status(200).json({
      statusCode: 200,
      status: "OK",
      message: "Remove Successful",
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      status: "Internal Server Error",
      message: error.message,
    });
  }
}

const getWishlist = async (req, res) => {
  try {
    const wishlists = await Wishlist.findOne({ user: req.params.user }).populate('products');
    const length = await Wishlist.countDocuments({ user: req.params.user });
    res.status(200).json({
      statusCode: 200,
      status: "OK",
      message: "Wishlists retrieved successfully",
      result: wishlists,
      total: wishlists.products.length,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

const get = async (req, res) => {
  try {
    const { sort, page, limit, filter } = req.query;

    const filterquery = FilterOptions(sort, page, limit, filter);

    const response = await Wishlist.find(filterquery.query,
      "-__v",
      filterquery.options).populate('products');
    const length = await Wishlist.countDocuments(filterquery.query);

    res.status(200).json({
      statusCode: 200,
      status: "OK",
      message: "Wishlists retrieved successfully",
      result: response,
      total: length,
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
    const Wishlist = await Wishlist.findById(req.params.id);
    if (!Wishlist) {
      return res.status(404).json({
        statusCode: 404,
        status: "Not Found",
        message: "Wishlist not found",
      });
    }
    res.status(200).json({
      statusCode: 200,
      status: "OK",
      result: Wishlist,
      message: "Wishlist retrieved successfully",
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
    const wishlist = await Wishlist.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('products');
    if (!wishlist) {
      return res.status(404).json({
        statusCode: 404,
        status: "Not Found",
        message: "Wishlist not found",
      });
    }
    res.status(200).json({
      statusCode: 200,
      status: "OK",
      result: wishlist,
      message: "Wishlist updated successfully",
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
    const Wishlist = await Wishlist.findByIdAndDelete(req.params.id);
    if (!Wishlist) {
      return res.status(404).json({
        statusCode: 404,
        status: "Not Found",
        message: "Wishlist not found",
      });
    }
    res.status(200).json({
      statusCode: 200,
      status: "OK",
      message: "Wishlist deleted successfully",
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
  get,
  getSingle,
  update,
  remove,
  getWishlist, removeProduct, addProduct, createWishlist
};
