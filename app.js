const express = require("express");
require("dotenv").config();
const connectDB = require("./src/db/dbConnact");
const { dbUrl, serverPort } = require("./src/config/setting");
const app = express();
var cors = require("cors");
const logMiddleware = require("./src/middleware/logger");

const userRouter = require("./src/routes/user");
const authRoute = require("./src/routes/auth");
const categoryRoute = require("./src/routes/categories");
const productRoute = require("./src/routes/products");
const publicRoute = require("./src/routes/public");
const cartRoute = require("./src/routes/cart");
const logRoute = require("./src/routes/logs");
const reviewRoute = require("./src/routes/reviews");
const BrandRoute = require("./src/routes/brand");
const PaymentRoute = require("./src/routes/payment");
const AddressRoute = require("./src/routes/address");
const orderRoute = require("./src/routes/orders");
const wishlistRoute = require("./src/routes/wishlist");
const AttachmentRoute = require("./src/routes/attachments");
const contactsRoute = require("./src/routes/contact");



app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("APP is working!");
});

app.get("/api", (req, res) => {
  res.send("API is working!");
});

app.use(logMiddleware);
app.use("/api", userRouter);
app.use("/api", authRoute);
app.use("/api", categoryRoute);
app.use("/api", productRoute);
app.use("/api", publicRoute);
app.use("/api", cartRoute);
app.use("/api", AddressRoute);
app.use("/api", logRoute);
app.use("/api", reviewRoute);
app.use("/api", BrandRoute);
app.use("/api", PaymentRoute);
app.use("/api", orderRoute);
app.use("/api", wishlistRoute);
app.use("/api", AttachmentRoute);
app.use("/api", contactsRoute);

const start = async (res) => {
  try {
    connectDB(dbUrl);
    app.listen(serverPort, () => {
      console.log(`Server is running on port ${serverPort}`);
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      status: "Internal Server Error",
      message: error.message,
    });
  }
};
start();
