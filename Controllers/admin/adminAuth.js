const jwt = require("jsonwebtoken");
const mongoose = require('mongoose')
const dotenv = require("dotenv");
const users = require("../../Models/UserSchema.js");
const Sessions = require("../../Models/UserSession.js");
dotenv.config();
const Cars = require("../../Models/CarsSchema.js");

const setInactiveAccount = async (req, res) => {
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
    target.post_limit = postLimit;
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

const viewAllActiveAndInactiveUsers = async(req , res) =>{
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).json({ NoUserExist: "User not recieved" });
    }
    if (!(user.account_type === "admin")) {
      return res.status(401).json({
        message: "you are not authorized for this operation",
      });
    }
    const inactiveusers = await users.find({status : 'inactive'});
    const standard = await users.find({subscription_type : 'standard'});
    const premium = await users.find({subscription_type : 'premium'});
    const enterprise = await users.find({subscription_type : 'enterprise'});
    const activeusers = await users.find({status : 'active'});
    const inactiveCount = inactiveusers.length;
    const activeCount = activeusers.length;
    const standardCount = standard.length
    const premiumCount = premium.length
    const EnterpriseCount = enterprise.length
    return res.status(200).json({
      Active_Users : activeCount,
      InActive_Users : inactiveCount,
      Total_Users : activeCount + inactiveCount,
      message : "Subscription Types : ",
      standard_Users : standardCount,
      premiumCount_Users : premiumCount,
      Enterprise_Users : EnterpriseCount
    })
  } catch (error) {
    console.log(error);
    return json({
      error : "internal Server Error"
    })
  }
}

module.exports = {
  setInactiveAccount,
  manageUsersPostCount,
  viewAllActiveAndInactiveUsers
};
