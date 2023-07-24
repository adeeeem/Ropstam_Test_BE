require("dotenv").config();
const jwtUtil = require("../Utils/jwt");
const jwt = require("jsonwebtoken");

module.exports.verifyToken = async function (req, res, next) {
  let token = req.get("Authorization");

  if (!token) {
    return res.status(401).send("You are not logged-in (token not found) !!");
  }

  if (token.includes("Bearer")) token = token.slice(7);

  let result = await jwtUtil.verify(token);

  if (!result) {
    return res.status(401).send("Unauthorized access (invalid token) !!");
  }

  req.user = jwt.decode(token).user;

  next();
};

const checkIsInRole =
  (...roles) =>
  (req, res, next) => {
    if (!req.user) {
      return res.status(401).send("user not found");
    }

    const hasRole = roles.find((role) => req.user.role === role);

    if (!hasRole) {
      return res.status(400).send("Access Control: Missuse Detected");
    }

    return next();
  };

module.exports.checkIsInRole = checkIsInRole;
