const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

//functions
function generateToken(payload) {
  console.log("Payload: ", payload);
  return jwt.sign(payload, process.env.SECRET_KEY);
}

async function hashPassword(password) {
  const salt = await bcrypt.genSalt();
  return bcrypt.hash(password, salt);
}

async function comparePassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

module.exports.generateToken = generateToken;
module.exports.hashPassword = hashPassword;
module.exports.comparePassword = comparePassword;
