const jwt = require("jsonwebtoken");
const mongoose = require('mongoose')
const dotenv = require("dotenv");
const users = require("../Models/UserSchema.js");
const Sessions = require("../Models/UserSession.js");
dotenv.config();
const Cars = require("../Models/CarsSchema.js");

const SetInactiveAccount = async (req, res) => {
  try {
    const { token } = req.cookies;
    const {targetId} = req.body;
    if (!targetId) {
      return res.status(401).json({
        message: "Target Id is not received",
      });
    }
    if (!mongoose.Types.ObjectId.isValid(targetId)) {
      return res.status(400).json({ error: "Invalid User ID" });
    }
    if (!token) {
      return res
        .status(401)
        .json({ error: "Token not found or expired, please login" });
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
    if (!decode) {
      return res.status(401).json({ error: "User authentication failed" });
    }
    const id = decode.id;
    if (!id) {
      return res.status(400).json({ error: "ID not found" });
    }
    const isUser = await users.findById(id);
    if (!isUser) {
      return res.status(404).json({ error: "User not found" });
    }
    if (!(isUser.account_type === "admin")) {
      return res.status(401).json({
        message: "you are not authorized for this operation",
      });
    }
    if (!(isUser.status === "active")) {
      return res.status(401).json({ error: "User is inactive" });
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

const DeleteanotherUserUsingId = async (req, res) => {
  try {
    const { token } = req.cookies;
    const {targetId} = req.body;
    if (!targetId) {
      return res.status(401).json({
        message: "no user id is passed",
      });
    }
    if (!mongoose.Types.ObjectId.isValid(targetId)) {
      return res.status(400).json({ error: "Invalid User ID" });
    }
    if (!token) {
      return res
        .status(401)
        .json({ error: "Token not found or expired, please login" });
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
    if (!decode) {
      return res.status(401).json({ error: "User authentication failed" });
    }
    const id = decode.id;
    if (!id) {
      return res.status(400).json({ error: "ID not found" });
    }
    const isUser = await users.findById(id);
    if (!isUser) {
      return res.status(404).json({ error: "User not found" });
    }
    if (!(isUser.status === "active")) {
      return res.status(401).json({ error: "User is inactive" });
    }
    if (!(isUser.account_type === "admin")) {
      return res.status(401).json({
        message: "you are not authorized for this",
      });
    }
    //delete user in users DB :
    const isuserDeleted = await users.findByIdAndDelete(targetId);
    if(!isuserDeleted){
      return res.status(404).json({
        message : "user does not exist"
      })
    }
    const isSessionDeleted = await Sessions.deleteOne({ userId : targetId});
    if(!isSessionDeleted){
      return res.status(404).json({
        message : "sessions not found"
      })
    }
    console.log("user Deleted");
    console.log("user sessions deleted")
    const isPostDeleted = await Cars.deleteMany({ owner_id : targetId })
    if(!isPostDeleted){
      return res.status(401).json({
        message : "error occured in Post delete operation"
      })
    }
    console.log("posts deleted");
    console.log("user deleted Succesfully");
    return res.status(200).json({
      message : "deleted_Succesfully",
      status : 200
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      deletionError : "Internal Server Error"
    });
  }
};

module.exports = {
  SetInactiveAccount,
  DeleteanotherUserUsingId,
};
