const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.verify = async function (token) {
  try {
    console.log("Jwt decoded: ", jwt.decode(token));
    return await jwt.verify(token, process.env.SECRET_KEY);
  } catch (error) {
    return;
  }
};
