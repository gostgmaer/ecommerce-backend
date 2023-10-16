const express = require("express");
var session = require("express-session");
const authRoute = express.Router();

const {
  signUp,
  signIn,
  resetPassword,
  singout,
  varifySession,
  changedPassword,
  forgetPassword,
  accountConfirm,getProfile
} = require("../../controller/authentication/auth");
const UpdatebyMiddleWare = require("../../middleware/updatedBy");
const createMiddleWare = require("../../middleware/createMiddleWare");
const userMiddleWare = require("../../middleware/userAccess");
const adminMiddleware = require("../../middleware/adminAccess");

const {
  validateSignUpRequest,
  isRequestValidated,
  validateSignIpRequest,
  validateForgetPassword,
  validateResetpassword,
  validateChangePassword
} = require("../../validator/auth");


authRoute.route("/auth/register").post(validateSignUpRequest, isRequestValidated,signUp);
authRoute.route("/auth/confirm-account/:token").post(accountConfirm);
authRoute.route("/auth/login").post(validateSignIpRequest, isRequestValidated,signIn);
authRoute.route("/auth/verify/session").post(varifySession);
authRoute.route("/auth/reset-password/:token").post(validateResetpassword,isRequestValidated,resetPassword);
authRoute.route("/auth/forget-password").post(validateForgetPassword,isRequestValidated,forgetPassword);
authRoute.route("/auth/change-password").post(userMiddleWare,UpdatebyMiddleWare,validateChangePassword,isRequestValidated,changedPassword);
authRoute.route("/auth/profile").get(userMiddleWare,getProfile);
authRoute.route("/auth/logout").post(userMiddleWare,singout);

module.exports = authRoute;
