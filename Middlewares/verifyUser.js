const jwt = require("jsonwebtoken");
require("dotenv").config();
const users = require("../Models/UserSchema.js");

const verifyUserUsingCookie = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ error: "please login" });
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
    if (!decode) {
      return res.status(401).json({ error: "User authentication failed" });
    }
    const status = decode.status;
    if (!status) {
      console.log("Status is not Received");
      return res.status(400).json({
        error: "Status is not Defined",
      });
    }
    //check the status of the user :
    if (!(status === "active")) {
      console.log("Account is Not Active, please verify your Account");
      return res.status(400).json({
        message: "Account Inactive please Verify",
      });
    }
    //way to pass a value from the middleware to mail function :
    const id = decode.id;
    if (!id) {
      return res.status(400).json({ error: "ID not found" });
    }
    const user = await users.findById(id);
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
};

module.exports = {verifyUserUsingCookie };
