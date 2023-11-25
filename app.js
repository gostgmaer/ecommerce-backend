const express = require("express");
require("dotenv").config();
const connectDB = require("./src/db/dbConnact");
const { dbUrl, serverPort } = require("./src/config/setting");
const app = express();
var cors = require("cors");
const logMiddleware = require("./src/middleware/logger");
const session = require("express-session");
const sessionStore = require("./src/db/sessionConnact");
const userRouter = require("./src/routes/user");
const authRoute = require("./src/routes/auth");
const categoryRoute = require("./src/routes/categories");
const productRoute = require("./src/routes/products");
const publicRoute = require("./src/routes/public");
const cartRoute = require("./src/routes/cart");
const logRoute = require("./src/routes/logs");
const reviewRoute = require("./src/routes/reviews");
const BrandRoute = require("./src/routes/brand");

app.use(
  session({
    store: sessionStore,
    secret: process.env.JWT_SECRET,
    httpOnly: false,
    resave: false,
    cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 },
    saveUninitialized: false,
  })
);

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
app.use("/api", logRoute);
app.use("/api", reviewRoute);
app.use("/api", BrandRoute);

const port = serverPort || 5000;
const start = async () => {
  try {
    connectDB(dbUrl);
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.log("error =>", error);
  }
};
start();
