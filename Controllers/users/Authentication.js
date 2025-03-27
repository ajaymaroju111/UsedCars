const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const users = require("../../Models/UserSchema.js");
const Cars = require("../../Models/CarsSchema.js");
const { sendEmail } = require("../../Nodemailer/Mails.js");
const catchAsync = require("../../Middlewares/catchAsync.js");
const ErrorHandler = require("../../utils/ErrorHandler.js");
const {
  forgetPasswordTemplate,
  AccountConformationafterRegister,
} = require("../../Nodemailer/MailTemplates/Templates.js");

// User Registration :
exports.signUpUser = catchAsync(async (req, res, next) => {
  try {
    const { username, email, password, phone, address, account_type } =
      req.body;
    if (
      !username ||
      !email ||
      !password ||
      !phone ||
      !address ||
      !account_type
    ) {
      return res
        .status(400)
        .json({ error: "All fields are required for the registration" });
    }
    //Search for the user in the DB :
    const isUser = await users.findOne({
      $or: [{ email }, { username }],
    });
    if (isUser) {
      if (isUser.username === username) {
        return next(
          new ErrorHandler(
            "Username already taken , try another username ",
            401
          )
        );
      }
      return next(
        new ErrorHandler("Email already exists", "please login ", 401)
      );
    }
    // const SaltRounds = await bcrypt.genSalt(10);
    // const HashedPassword = await bcrypt.hash(password, SaltRounds);
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const user = await users.create({
      profileImage: {
        name: req.file.originalname,
        img: {
          data: req.file.buffer, // Store buffer data
          contentType: req.file.mimetype,
        },
      },
      username,
      email,
      password,
      phone,
      phone,
      address,
      account_type,
    });
    await user.save();
    
    const encodedEmail = Buffer.from(email, "utf-8").toString("base64");
    await sendEmail({
      to: user.email,
      subject: "Account Conformation for UsedCars Platform",
      text: AccountConformationafterRegister(user.username, encodedEmail),
    });
    user.expiryTime = Date.now() + 10 * 60 * 1000;
    await user.save();
    return res.status(200).json({
      message:
        "user registration conformation has send to the email !!  Please Verify",
    });
  } catch (error) {
    console.log(`registration error : ${error}`);
    return res.status(500).json({ RegistrationError: error });
  }
});

// user registration conformation :
exports.ConformUserAccount = catchAsync(async (req, res, next) => {
  try {
    const { Registertoken } = req.body;
    if (!Registertoken) {
      console.log("register token is not received");
      return res.status(400).json({
        message: "Access token is not received",
      });
    }
    //decode the email using Buffer:
    const decodedEmail = Buffer.from(Registertoken, "base64").toString("utf-8");
    //check weather the users  exist or not :
    const user = await users.findOne({ email: decodedEmail });
    if (!user) {
      return next(new ErrorHandler("User not found, please register", 404));
    }
    //check weather the time expired or not :
    if (Date.now() > user.expiryTime) {
      await users.deleteOne({ email: decodedEmail });
      return next(new ErrorHandler("Time expired , please Register", 401));
    }
    user.status = "active";
    user.VerifyToken = undefined;
    user.expiryTime = undefined;
    await user.save();
    return res.status(200).json({
      message: "user verified Succesfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "internal Server error",
    });
  }
});

//user login using  email and  password :
exports.loginUser = catchAsync(async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(401)
        .json({ AllFieldsRequired: "All fields are required for the login" });
    }
    const user = await users.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ UserNotExist: "user does not exist!!.. please register" });
    }

    //chack weather the user is active or not :
    if (!(user.status === "active")) {
      return next(
        new ErrorHandler("account is not verified , please verify", 401)
      );
    }
    //compare the password :
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
      return next(new ErrorHandler("password doesn't match", 401));
    }
    //create a token :
    const data = {
      id: user._id,
      username: user.username,
      email: user.email,
      status: user.status,
    };
    const key = process.env.JWT_SECRET;
    const expiry = { expiresIn: "1h" };
    const token = jwt.sign(data, key, expiry);
    //cookie is generated :
    await res.cookie("token", token, {
      httpOnly: true,
      secure: true, // Use only in HTTPS
      sameSite: "Strict",
    });
    console.log({
      login: "user logged in Successfully",
      Cookie: true,
      status: 200,
    });
    return res.status(200).json({
      Success: "User Logged in Successfully !!",
    });
  } catch (error) {
    console.log(`login error : ${error}`);
    return res.status(500).json({
      LoginError: error,
    });
  }
});

//user logout :
exports.LogoutUser = catchAsync(async (req, res, next) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true, // Use only in HTTPS
    sameSite: "Strict",
  });
  res.json({ message: "User logged out successfully" });
});

//get user profile by user ID and only when the user is active :
exports.getUserProfile = catchAsync(async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      return next(new ErrorHandler("cookie expired , please login", 404));
    }
    res.status(200).json(user.fullname);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: `NotGettingProfile ${error}`,
    });
  }
});

//sending forget password link to the user email :
exports.forgetPassword = catchAsync(async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(404).json({ NoUserExist: "please Enter the Email" });
    }
    const user = await users.findOne({ email });
    if (!user) {
      return next(
        new ErrorHandler("User not found , please Enter valid email")
      );
    }
    await sendEmail({
      to: user.email,
      subject: "Link for the Forget Password",
      text: forgetPasswordTemplate(user.fullname),
    });
    console.log("Mail sent to the user");
    return res.status(200).json({ Success: "password link sent to the mail" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ forgetPassword: error });
  }
});

//user reset password :  No Authentication required :
exports.resetPassword = catchAsync(async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res
        .status(401)
        .json({ required: "old password and new password are required" });
    }
    const user = await users.findById(req.user._id).select('+password')
    const isPasswordMatched = await user.comparePassword(oldPassword, user.password);
    if (!isPasswordMatched) {
      return next(new ErrorHandler("password doesn't Match", 401));
    }
    user.password = newPassword;
    await user.save();
    return res
      .status(200)
      .json({ successful: "password updated Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error });
  }
});

//get user profile by id within in the user expire time :
exports.getProfileById = catchAsync(async (req, res, next) => {
  const user = req.user;
  if (!user) {
    return next(new ErrorHandler("cookie expired , please login", 404));
  }
  return res.status(200).json(user.fullname);
});

//update user profile based on cookie :
exports.UpdateProfile = catchAsync(async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      return next(new ErrorHandler("cookie expired , please login", 404));
    }
    const { newemail, newpassword } = req.body;
    if (newemail) {
      user.email = newemail;
    }
    if (newpassword) {
      const hashedPass = await bcrypt.hash(newpassword, 10);
      user.password = hashedPass;
    }
    await user.save();
    console.log("user updated Successfully");
    return res.status(200).json({ user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error });
  }
});

exports.userPosts = catchAsync(async (req , res, next) =>{
  const posts = await Cars.find({owner_id : req.user._id});
  if(posts.length === 0){
    return res.status(201).json({
      message : "No posts has been uploaded"
    });
  }
  return res.status(200).json({
    success : true,
    posts,
  })
})

//Delete user account based on the cookie :
exports.deleteProfile = catchAsync(async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      return next(new ErrorHandler("cookie expired , please login", 404));
    }
    await users.findByIdAndDelete(user._id);
    await Cars.deleteMany({ owner_id: id });
    return res.status(200).json({
      success: true,
      message: "user Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
});
