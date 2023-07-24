var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

router.post("/login", async (req, res, next) => {
  try {
    const { emailAddress, password } = req.body;

    const user = await UserModel.findOne({
      emailAddress: emailAddress,
      role: "user",
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Wrong password" });
    }

    const token = jwt.sign({ user }, "your-secret-key", { expiresIn: "1h" });
    res.json({ user, token });
  } catch (error) {
    console.log("error (try-catch) : " + error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

router.post("/signup", async (req, res, next) => {
  try {
    const requiredParameters = ["emailAddress"];

    const missingAttribute = checkMissingAttributes(
      req.body,
      requiredParameters
    );
    if (missingAttribute != null) {
      return res.status(400).json({
        success: false,
        message: missingAttribute + " not found in request body",
      });
    }

    const { emailAddress } = req.body;

    const exist = await UserModel.findOne({
      emailAddress: emailAddress,
    });

    if (exist) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const generatedPassword = Math.random().toString(36).slice(-8); // Random 8-character password
    const hashedPassword = await bcrypt.hash(generatedPassword, 10);

    const newUser = new UserModel({
      emailAddress: emailAddress,
      password: hashedPassword,
      role: "user",
    });

    await newUser.save();

    const transporter = nodemailer.createTransport({
      service: "your-email-service-provider",
      auth: {
        user: "your-email-address",
        pass: "your-email-password",
      },
    });

    const mailOptions = {
      from: "your-email-address",
      to: emailAddress,
      subject: "Account Registration",
      text: `Thank you for registering! Your password is: ${generatedPassword}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });

    res.json({ success: true, message: "User registered successfully" });
  } catch (error) {
    console.log("error (try-catch) : " + error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

module.exports = router;
