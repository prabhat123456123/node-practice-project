const dotenv = require("dotenv");
dotenv.config();

const CONSTANTS = {
  EMAIL: process.env.EMAIL,
  PASS: process.env.EMAILPASSWORD,
};

module.exports = CONSTANTS;
