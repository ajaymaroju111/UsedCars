const users = require("../../Models/UserSchema.js");
const cars = require("../../Models/CarsSchema.js");
const catchAsync = require('../../Middlewares/catchAsync.js');
const dotenv = require("dotenv").config();

//Deactivate user
exports.deactivateUser = catchAsync ( async (req, res , next) => {
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
});

//manage post limit for the user : 
exports.setPostLimit = catchAsync ( async(req , res , next) =>{
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
});

//view all active and inactive users : 
exports.allUserTypes = catchAsync ( async(req , res , next) =>{
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
});

//update Subscription type and
exports.userPlan = catchAsync( async (req, res , next) => {
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
    const { userId, subscription } = req.body;
    if (!userId) {
      console.log("user id not received");
      return res.status(401).json({
        message: "userId not received",
      });
    }
    const target = await users.findById(userId);
    if (!target) {
      console.log("user does not Exist");
      return res.status(404).json({
        message: "user not found",
      });
    }
    if (!(target.status == "active")) {
      console.log("user is Inactive");
      return res.status(401).json({
        message: "User account is not in Active",
      });
    }

    if (target.subscription_type === subscription) {
      console.log(`user subscription type already in ${subscription}`);
      return res.status(401).json({
        message: `user subscription type already in ${subscription}`,
      });
    }

    target.subscription_type = subscription;
    await target.save();
    return res.status(200).json({
      message: `user subscription type changed Successfully to ${subscription}`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
});

//Read the user Details based on their ID :
exports.userPosts = catchAsync( async (req, res , next) => {
  try {
    const user = req.user;
    const userId = req.headers["authentication"];
    if (!user) {
      return res.status(404).json({ NoUserExist: "User not recieved" });
    }
    if (!(user.account_type === "admin")) {
      return res.status(401).json({
        message: "you are not authorized for this operation",
      });
    }
    console.log(userId);
    if (!userId) {
      console.log("user id not Recived");
      return res.status(401).json({
        message: "user id not received",
      });
    }
    const target = await users.findById(userId);
    if (!target) {
      console.log("user not Found");
      return res.status(404).json({
        message: "User not Found",
      });
    }
    const posts = await cars.find({ owner_id: userId });
    if (posts.length === 0) {
      console.log("no post available on this account");
      return res.status(200).json({
        message: "No posts are available in this account",
      });
    }
    return res.status(200).json({
      userDetailsd: {
        user: target.fullname,
        number_of_posts: posts.length,
        all_posts: posts,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
});

