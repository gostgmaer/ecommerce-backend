const express = require("express");
require("dotenv").config();
const connectDB = require("./src/db/dbConnact");
const app = express();
var cors = require("cors");
const session = require("express-session");
const sessionStore = require("./src/db/sessionConnact");

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

//app route
// app.use("/api", authRouter);
//Port and Connect to DB

const port = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.log("error =>", error);
  }
};
start();
