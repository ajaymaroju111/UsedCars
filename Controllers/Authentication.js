const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const users = require("../Models/UserSchema.js");
const Sessions = require("../Models/UserSession.js");
const Cars = require('../Models/CarsSchema.js')
const { sendEmail } = require("../Nodemailer/Mails.js");
const { CreateToken } = require("../Middlewares/Tokens/UserToken.js");
const {
  forgetPasswordTemplate,
  AccountConformationafterRegister,
} = require("../Nodemailer/MailTemplates/Templates.js");

// User Registration :
const UserRegister = async (req, res) => {
  try {
    const { fullname, email, password, phone, address, account_type } =
      req.body;
    if (
      !fullname ||
      !email ||
      !password ||
      !phone ||
      !address ||
      !account_type
    ) {
      return res
        .status(401)
        .json({ error: "All fields are required for the registration" });
    }
    //Search for the user in the DB :
    const isUser = await users.findOne({ email });
    if (isUser) {
      return res
        .status(404)
        .json({ UserExist: "User already exist please login" });
    }
    const SaltRounds = await bcrypt.genSalt(10);
    const HashedPassword = await bcrypt.hash(password, SaltRounds);
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
      fullname,
      email,
      password: HashedPassword,
      phone,
      phone,
      address,
      account_type,
    });
    await user.save();
    const Registertoken = CreateToken(user);
    await sendEmail({
      to: user.email,
      subject: "Account Conformation for UsedCars Platform",
      text: AccountConformationafterRegister(user.fullname, Registertoken),
    });
    //create and store token in Sessions collection :
    const session = await Sessions.create({
      useremail: user.email,
      userId: user._id,
      VerifyToken: Registertoken,
      expiryTime: Date.now() + 10 * 60 * 1000,
    });
    await session.save();
    return res.status(200).json({
      message:
        "user registration conformation has send to the email !!  Please Verify",
    });
  } catch (error) {
    console.log(`registration error : ${error}`);
    return res.status(500).json({ RegistrationError: error });
  }
};

// user registration conformation :
const ConformUserRegister = async (req, res) => {
  try {
    const { email, Registertoken } = req.body;
    if (!email || !Registertoken) {
      return res.status(401).json({
        error: "All fields are required please enter",
      });
    }
    //check for the user exist or not :
    const user = await users.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    //check weather the users sessions exist or not :
    const session = await Sessions.findOne({ useremail: email });
    if (!session) {
      return res.status(404).json({
        message: "session not found",
      });
    }
    //check weather the time expired or not :
    if (Date.now() > session.expiryTime) {
      await users.deleteOne({ email });
      await Sessions.deleteOne({email});
      console.log("all data deleted");
      return res.status(401).json({
        message: "Time expired!!.. please register again",
      });
    }
    const isTokenValid = (session.VerifyToken === Registertoken);
    const validId = session.userId == user._id;
    if (!isTokenValid) {
      return res.status(401).json({
        message: "token register authentication failed",
      });
    }
    if (!validId) {
      return res.status(401).json({
        message: "user register authentication failed",
      });
    }
    //free up the space in sessions :
    const cleared = await Sessions.deleteMany({ email });
    if (!cleared) {
      return res.status(401).json({
        message: "sessions data doesnot deleted",
      });
    }
    user.status = "active";
    await user.save();
    session.VerifyToken = undefined;
    session.expiryTime = undefined;
    await session.save();
    return res.status(200).json({
      message: "user verified Succesfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "internal Server error",
    });
  }
};

//user login using  email and  password
const Login = async (req, res) => {
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
      return res
        .status(401)
        .json({ message: "user is not active please verify the email" });
    }
    //compare the password :
    const pass = await bcrypt.compare(password, user.password);
    if (!pass) {
      return res.status(400).json({ IncorrectPassword: `incorrect password` });
    }
    //create a token :
    const token = CreateToken(user);
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
};

//user logout:
const LogoutUsingCookie = async (req, res) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ invalidToken: "invalid Token" });
    }
    console.log(token);
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    if (!decode) {
      return res.status(401).json({ NotValid: "token is not Correct" });
    }
    res.clearCookie("token"); // Clear the authentication token
    res.json({ message: "User logged out successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ LogoutError: error });
  }
};

//get user profile by user ID and only when the user is active :
const getProfile = async (req, res) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ TokenNotFound: "token not found" });
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    if (!decode) {
      return res.status(401).json({ NotValid: "token is not valid" });
    }
    const id = decode.id;
    if (!id) {
      return res.status(401).json({ IdNotFound: "id not found in the token" });
    }
    const user = await users.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ UserNotFound: "User not found please register" });
    }
    if (!(user.status === "active")) {
      return res
        .status(401)
        .json({ message: "user is not active please verify the email" });
    }
    res.status(200).json(user.fullname);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: `NotGettingProfile ${error}` });
  }
};

//sending forget password link to the user email
const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(401).json({ required: "Email is required" });
    }
    const user = await users.findOne({ email });
    if (!user) {
      return res.status(404).json({ NoUserExist: "User does not Exist" });
    }
    if (!(user.status === "active")) {
      return res
        .status(401)
        .json({ message: "user is not active please verify the email" });
    }
    await sendEmail({
      to: user.email,
      subject: "Link for the Forget Password",
      text: forgetPasswordTemplate(),
    });
    console.log("Mail sent to the user");
    return res.status(200).json({ Success: "password link sent to the mail" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ forgetPassword: error });
  }
};

//user reset password :  No Authentication required
const resetPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const { token } = req.cookies;
    if (!oldPassword || !newPassword) {
      return res
        .status(401)
        .json({ required: "old password and new password are required" });
    }
    if (!token) {
      return res
        .status(400)
        .json({ TokenNotFound: "token did not found in cookie" });
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    if (!decode) {
      return res.status(401).json({ NotValid: "token is not valid" });
    }
    const id = decode.id;
    const user = await users.findById(id);
    if (!user) {
      return res.status(404).json({ userNotFound: "user did not found" });
    }
    const isPass = await bcrypt.compare(oldPassword, user.password);
    if (!isPass) {
      return res
        .status(400)
        .json({ PasswordDoesnotMatch: "old password does not match" });
    }
    const SaltRounds = bcrypt.genSaltSync(10);
    const newHashedpassword = await bcrypt.hash(newPassword, SaltRounds);
    user.password = newHashedpassword;
    await user.save();
    return res
      .status(200)
      .json({ successful: "password updated Successfully" });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

//get user profile by id within in the session expire time :
const GetProfileById = async (req, res) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({
        TokenNotFound: "token not found in the cookie",
      });
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    if (!decode) {
      return res.status(401).json({ NotValid: "token is not valid" });
    }
    const id = decode.id;
    if (!id) {
      return res.status(401).json({ IdNotFound: "id not found in the token" });
    }
    const user = await users.findById(id);
    if (!user) {
      return res.status(404).json({ invalid: "User not found" });
    }
    if (!(user.status === "active")) {
      return res
        .status(401)
        .json({ message: "user is not active please verify the email" });
    }
    return res.status(200).json(user.fullname);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

//update user profile based on cookie :
const UpdateUserProfile = async (req, res) => {
  const { token } = req.cookies;
  const { newemail, newpassword } = req.body;
  if (!token) {
    return res
      .status(401)
      .json({ message: "cannot get a token from a cookie" });
  }
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    if (!decode) {
      return res.status(401).json({ NotValid: "token is not Correct" });
    }
    const id = decode.id;
    if (!id) {
      return res
        .status(401)
        .json({ error: "user ID could not get from a token" });
    }
    const user = await Data.findById(id);
    if (!user) {
      return res.status(404).json({ message: "user does not exist" });
    }
    if (!(user.status === "active")) {
      return res
        .status(401)
        .json({ message: "user is not active please verify the email" });
    }
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
};

//Delete user account based on the cookie :
const DeleteUserAccount = async (req, res) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(400).json({ message: "no token found from the cookie" });
  }
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    if (!decode) {
      return res.status(401).json({ message: "invalid token" });
    }
    const id = decode.id;
    if (!id) {
      return res.status(400).json({ message: "user id not found in token" });
    }
    const user = await users.findById(id);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    //check weather the user is active or inactive :
    if (!(user.status === "active")) {
      return res
        .status(401)
        .json({ message: "user is not active please verify the email" });
    }
    const target = await users.findByIdAndDelete(id);
    if (!target) {
      return res
        .status(404)
        .json({ message: "error occured in deleting the account" });
    }
    const clearSessions = await Sessions.findByIdAndDelete(id);
    if (!clearSessions) {
      return res.status(401).json({
        message: "error occured in clear session operation",
      });
    }
    const isPostDeleted = await Cars.deleteMany({ owner_id : id })
    if(!isPostDeleted){
      return res.status(401).json({
        message : "error occured in Post delete operation"
      })
    }
    return res.status(200).json({ success: "user deleted Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
};

module.exports = {
  UserRegister,
  ConformUserRegister,
  Login,
  getProfile,
  forgetPassword,
  LogoutUsingCookie,
  resetPassword,
  GetProfileById,
  UpdateUserProfile,
  DeleteUserAccount,
};
