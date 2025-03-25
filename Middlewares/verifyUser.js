const jwt = require("jsonwebtoken");
require("dotenv").config();
const users = require("../Models/UserSchema.js");
const catchAsync = require("./catchAsync.js");

exports.verifyUserUsingCookie = catchAsync(async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ error: "please login" });
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
    //check the status of the user :
    if (!(decode.status === "active")) {
      console.log("Account is Not Active, please verify your Account");
      return res.status(400).json({
        message: "Account Inactive please Verify",
      });
    }
    const user = await users.findById(decode.id);
    if (!user) {
      console.log("user not Found in the verification");
      return res.status(404).json({
        error: "User not found",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "internal Server Error",
    });
  }
});
