const { hashPassword, generateToken } = require("./compare-password");
const UserModel = require("../models/UserModels");

async function createUser(
  fullName,
  phoneNumber,
  emailAddress,
  password,
  username,
  walletAddress,
  role
) {
  try {
    console.log("Before creating user");
    const newUser = await UserModel.create({
      fullName: fullName,
      phoneNumber: phoneNumber,
      emailAddress: emailAddress,
      password: password,
      username: username,
      walletAddress: walletAddress,
      role: role,
    });
    console.log("New user: ", newUser);
    return newUser;
  } catch (error) {
    console.log("error (try-catch) : " + error);
    return {
      success: false,
      error: error.message,
    };
  }
}

async function registerUser(
  fullName,
  phoneNumber,
  emailAddress,
  password,
  username,
  walletAddress,
  role
) {
  try {
    const hashedPassword = await hashPassword(password);

    console.log("Getting password");

    const user = await createUser(
      fullName,
      phoneNumber,
      emailAddress,
      hashedPassword,
      username,
      walletAddress,
      role
    );

    const token = generateToken({ user });

    return { success: true, user, token };
  } catch (error) {
    console.log("error (try-catch) : " + error);
    return {
      success: false,
      error: error.message,
    };
  }
}

module.exports.createUser = createUser;
module.exports.registerUser = registerUser;
