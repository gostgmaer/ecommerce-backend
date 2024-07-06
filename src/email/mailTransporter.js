// emailService.js
const {
  mailService,
  mailPassword,
  mailUserName,
} = require("../config/setting");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

// Create and export the Nodemailer transporter

let Mailconfig = {
  service: 'mailgun',
  auth: {
    user: 'postmaster@sandbox476d076802b54d048dc94cfa7038af6e.mailgun.org',
    pass: "88ea6f9a4b6358a7669d9777e640494e-8c90f339-212b0b67",
  },
};

const transporter = nodemailer.createTransport(Mailconfig);

module.exports = transporter;
