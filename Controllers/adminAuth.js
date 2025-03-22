const jwt = require("jsonwebtoken");
const mongoose = require('mongoose')
const dotenv = require("dotenv");
const users = require("../Models/UserSchema.js");
const Sessions = require("../Models/UserSession.js");
dotenv.config();
const Cars = require("../Models/CarsSchema.js");

const SetInactiveAccount = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).json({ NoUserExist: "User not recieved" });
    }
    const {targetId} = req.body;
    if (!targetId) {
      return res.status(401).json({
        message: "Target Id is not received",
      });
    }
    if (!(user.account_type === "admin")) {
      return res.status(401).json({
        message: "you are not authorized for this operation",
      });
    }
    const target = await users.findById(targetId);
    if (!target) {
      return res.status(401).json({
        message: "no target user found on the ID",
      });
    }
    target.status = "inactive";
    await target.save();
    return res.status(200).json({
      message: "Account status set to INACTIVE successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status({
      error: "Internal server error." 
    });
  }
};

const manageUsersPostCount = async(req , res) =>{
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).json({ NoUserExist: "User not recieved" });
    }
    const {targetId , postLimit} = req.body;
    if (!targetId) {
      return res.status(401).json({
        message: "Target Id is not received",
      });
    }
    if (!(user.account_type === "admin")) {
      return res.status(401).json({
        message: "you are not authorized for this operation",
      });
    }
    const target = await users.findById(targetId);
    if (!target) {
      return res.status(401).json({
        message: "no target user found on the ID",
      });
    }
    //Manage the posts of the specific User : 
    user.post_limit = postLimit;
    await user.save();
    console.log("Successfully set post limit");
    return res.status(200).json({
      message : "post limit Set Successfully"
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error : "Internal Server Error"
    })
  }
};

module.exports = {
  SetInactiveAccount,
  manageUsersPostCount,
};
