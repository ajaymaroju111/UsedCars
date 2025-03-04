const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Data = require("../Models/UserSchema.js");
const Meta = require("../Models/IdsAndMails.js");
const session = require("../Models/UserSession.js");
const { sendEmail } = require("../Nodemailer/Mails.js");
const { CreateToken } = require("./Tokens/UserToken.js");
const { JoiUserregisterSchema,
  JoiConformRegister,
  JoiLoginValidation,
  JoiConformLogin,
  JoiForgetPassword } = require("../Joi/Joi.js");
const {
  registerOtpTemplate,
  AfterConformRegisterEmail,
  LoginOtpTemplate,
  forgetPasswordTemplate,
} = require("../Nodemailer/MailTemplates/Templates.js");

// User Registration :
const UserRegister = async (req, res) => {
  const { error } = JoiUserregisterSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ msg: error.details[0].message });
  }
  try {
    const { firstname, middlename, lastname, email, password, DOB, phone } =
      req.body;
    if (!email) {
      return res
        .status(400)
        .json({ error: "Email is required for the registration" });
    }
    //Search for the user in the DB :
    const isUser = await Data.findOne({ email });
    if (isUser) {
      return res
        .status(201)
        .json({ UserExist: "User already exist please login" });
    }
    const HashedPassword = (await bcrypt.hash(password, 10)).toString();
    const user = await Data.create({
      firstname,
      middlename,
      lastname,
      email,
      password: HashedPassword,
      DOB,
      phone,
    });
    await user.save();
    const FullName = `${user.firstname} ${user.middlename} ${user.lastname}`;
    const registerOTP = Math.floor(100000 + Math.random() * 900000).toString();
    await sendEmail({
      to: user.email,
      subject: "OTP verification for registration process of UsedCars",
      text: registerOtpTemplate(FullName, registerOTP),
    });
    user.expiryTime = Date.now() + 10 * 60 * 1000;
    const hashedOTP = await bcrypt.hash(registerOTP, 10);
    user.otp = hashedOTP;
    await user.save();
    return res
      .status(200)
      .json({ message: "User registered and OTP has send to the email" });
  } catch (error) {
    console.log(`registration error : ${error}`);
    return res.status(400).json({ RegistrationError: error });
  }
};

//user register conformation :
const ConformRegistration = async (req, res) => {
  const { error } = JoiConformRegister.validate(req.body);
  if (error) {
    return res.status(400).json({ msg: error.details[0].message });
  }
  try {
    const { email, otp } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ MailNotFound: "email is required for conform registration" });
    }
    if (!otp) {
      return res
        .status(400)
        .json({ MailNotFound: "otp is required for conform registration" });
    }
    const user = await Data.findOne({ email });
    if (!user) {
      return res.status(400).json({ UserNotFound: "incorrect email" });
    }
    if (Date.now() > user.expiryTime) {
      return res.status(400).json({ expired: "OPT is expired" });
    }
    const MatchOtp = bcrypt.compare(otp, user.otp);
    if (!MatchOtp) {
      returnres.status(400).json({ NoMatch: "OTP does not match" });
    }
    const userMeta = await Meta.create({
      id: user._id,
      email: user.email,
    });
    await userMeta.save();
    user.expiryTime = undefined; //free the otp variable :
    //send the successfull message :
    const FullName = `${user.firstname} ${user.middlename} ${user.lastname}`;
    await sendEmail({
      to: user.email,
      subject: "Welcome to the UsedCars Platform",
      text: AfterConformRegisterEmail(FullName),
    });
    user.otp = undefined;
    await user.save();
    return res
      .status(200)
      .json({ sucess: "user registration conformed successfully" });
  } catch (error) {
    console.log(` registration conformation error : ${error}`);
  }
};

//user login using  email and  password
const Login = async (req, res) => {
  const { error } = JoiLoginValidation.validate(req.body);
  if (error) {
    return res.status(400).json({ msg: error.details[0].message });
  }
  try {
    const { email, password } = req.body;
    if (!email) {
      return res
        .status(401)
        .json({ EmailRequired: "email is required for the login" });
    }
    if (!password) {
      return res
        .status(401)
        .json({ passwordRequired: "password is required for the login" });
    }
    const user = await Data.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ UserNotExist: "user doesnot exist!!.. please register" });
    }
    //compare the password :
    const isPass = await bcrypt.compare(password, user.password);
    if (!isPass) {
      return res.status(401).json({ IncorrectPassword: `incorrect password` });
    }
    const FullName = `${user.firstname} ${user.middlename} ${user.lastname}`;
    const registerOTP = Math.floor(100000 + Math.random() * 900000).toString();
    await sendEmail({
      to: user.email,
      subject: "OTP verification for registration process of UsedCars",
      text: LoginOtpTemplate(FullName, registerOTP),
    });
    user.expiryTime = Date.now() + 10 * 60 * 1000;
    const hashedOTP = await bcrypt.hash(registerOTP, 10);
    user.otp = hashedOTP;
    await user.save();
    return res
      .status(200)
      .json({ Sucess: "user registered please check email for the OTP" });
  } catch (error) {
    console.log(`logon error : ${error}`);
    return res.status(500).json({
      LoginError: error,
    });
  }
};

//conform User Login :
const ConformLogin = async (req, res) => {
  const { error } = JoiConformLogin.validate(req.body);
  if (error) {
    return res.status(400).json({ msg: error.details[0].message });
  }
  try {
    const { email, otp } = req.body;
    if (!email) {
      return res.status(401).json({ FieldRequired: "Email is Required" });
    }
    if (!otp) {
      return res.status(401).json({ FieldRequired: "otp is Required" });
    }
    const user = await Data.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ UserNotExist: "User doesnot exist please register" });
    }
    if (Date.now() > user.expiryTime) {
      return res.status(408).json({ expired: "OTP has expired" });
    }
    const isOTP = bcrypt.compare(otp, user.otp);
    if (!isOTP) {
      return res.status(400).json({ invalid: "invalid OTP" });
    }
    //create a token :
    const token = CreateToken(user);
    //cookie is genrated :
    await res.cookie("token", token, {
      httpOnly: true,
      secure: true, // Use only in HTTPS
      sameSite: "Strict",
    });
    //save the user session in session table :
    const Session = await session.create({
      userId: user._id,
      userToken: token,
      tokenExpiresIn: Date.now() + 60 * 60 * 1000,
    });
    Session.save();
    console.log({
      login: "user logged in Successfully",
      Cookie: true,
      status: 200,
    });
    user.otp = undefined;
    await user.save();
    return res.status(200).json({
      sucessfull: "user login Succesfully",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ ConformLogin: `user login not confirmed ${error}` });
  }
};

//user logout :
const LogoutUsingCooke = async (req, res) => {
  try {
    const {token} = req.cookies;
    console.log(token);
    const decode = jwt.verify(token , process.env.JWT_SECRET);
    if(!decode){
      return res.status(401).json({NotValid : "token is not Correct"})
    }
    if (!token) {
      return res.status(401).json({ invaliToken: "invalid Token" });
    }
    await session.deleteMany({ userToken : token });
    console.log("user sessions data is deleted");
    res.clearCookie("authToken"); // Clear the authentication token
    res.json({ message: "User logged out successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ LogoutError: error });
  }
};

//get profile using cookie :
const getProfile = async (req, res) => {
  try {
    const {token} = req.cookies;
    if (!token) {
      return res.status(401).json({ error: "No token found in cookies found" });
    }
    const decode = jwt.verify(token , process.env.JWT_SECRET);
    if(!decode){
      return res.status(401).json({NotValid : "token is not Correct"})
    }
    const UserSess = await session.find({userToken :  token} );
    if (!UserSess) {
      return res
        .status(400)
        .json({ sessionExpired: "Session expired please login" });
    }
    if (Date.now() > UserSess.tokenExpiresIn) {
      await UserSess.deleteMany({ token });
      await UserSess.save();
      console.log("logs deleted successfully");
      res.status(401).json({ Expired: "token Session expired" });
    }
    res.json({ token });
  } catch (error) {
    console.log(error)
    res.json({ error: `tokenerror ${error}` });
  }
};

//sending forget password link to the user email
const forgetPassword = async (req, res) => {
  const { error } = JoiForgetPassword.validate(req.body);
  if (error) {
    return res.status(400).json({ msg: error.details[0].message });
  }
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(401).json({ required: "Email is required" });
    }
    const user = await Data.findOne({ email });
    if (!user) {
      return res.status(400).json({ NoUserExist: "User does not Exist" });
    }
    await sendEmail({
      to: user.email,
      subject: "Link for the Forget Password",
      text: forgetPasswordTemplate(),
    });
    return res.status(200).json({ Sucess: "password link sent to the mail" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ forgetPassword: error });
  }
};

//user reset password :
const resetPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const id = req.cookie.id;
    if (!oldPassword || !newPassword) {
      return res
        .status(401)
        .json({ required: "old password and new password are required" });
    }
    if (!token) {
      return res
        .status(401)
        .json({ TokenNotFound: "token did not found in cookie" });
    }
    const UserSess = await session.findOne({ userId: id });
    if (Date.now() > UserSess.tokenExpiresIn) {
      await UserSess.deleteOne({userId: id});
      await UserSess.save();
      console.log("logs deleted successfully");
      res.status(401).json({ Expired: "token Session expired" });
    }
    const user = await Data.findOne({ id });
    if (!user) {
      return res.status(400).json({ userNotFound: "user did not found" });
    }
    const isPass = await bcrypt.compare(oldPassword, user.password);
    if (!isPass) {
      return res
        .status(401)
        .json({ PasswordDoesnotMatch: "old password doesnot match" });
    }
    const newHashedpassword = bcrypt.hash(oldPassword, 10);
    user.password = newHashedpassword;
    await user.save();
    return rs.status(200).json({ sucessfull: "password updated Successfully" });
  } catch (error) {
    return res.status(400).json({ error: error });
  }
};

//get user profile by id within in the session expire time :
const GetProfileById = async (req, res) => {
  try {
    const {id} = req.cookie.userId;
    if (!id) {
      return res.status(401).json({ IdNotFound: "id not found in the token" });
    }
    const UserSess = await session.findOne({ id });
    if (!UserSess) {
      return res.status(401).json({ invaid: "invalid Id OR Token" });
    }
    if (Date.now() > UserSess.tokenExpiresIn) {
      await UserSess.deleteMany({ id });
      await UserSess.save();
      console.log("logs deleted successfully");
      return res.status(401).json({ Expired: "token Session expired" });
    }
    const user = await Data.findOne({ id });
    if (!user) {
      return res.status(401).json({ invaid: "invalid Id OR Token" });
    }
    return res.json({ user });
  } catch (error) {
    return res.json({ error: error });
  }
};

//update user profile based on cookie : 
const UpdateUserProfile = async(req , res) =>{
  const {token} = req.cookies;
  const {email , password} = req.body;
  if(!token){
    return res.status(401).json({message : "cannot get a token from a cookie"})
  }
  try {
    const decode = jwt.verify(token , process.env.JWT_SECRET);
    if(!decode){
      return res.status(401).json({NotValid : "token is not Correct"});
    }
    const {id} = token.id;
    if(!id){
      return res.status(401).json({error : "user ID could not get from a token"});
    }
    const user = await Data.findById({userId : id});
    if(!user){
      return res.status(400).json({message : "user does not exist"});
    }
    if(email){
      user.email = email;
    }
    if(password){
      const hashedPass = await bcrypt.hash(password , 10);
      user.password = hashedPass;
    }
    await user.save();
    console.log("user updated Successfully");
    return res.status(200).json({user})
    
  } catch (error) {
    console.log(error);
    return res.status(400).json({error : error});
  }
}

//Delete user account based on the cookie : 
const DeleteUserAccount = async(req , res) =>{
  const {token} = req.cookies;
  if(!token){
    return res.status(400).json({message : "no token found from the cookie"});
  }
  try {
    const decode = jwt.verify(token , process.env.JWT_SECRET);
    if(!decode){
      return res.status(400).json({message : "invalid token"})
    }
    const {id} = token.id;
    if(!id){
      res.status(400).json({message : "user id not found in token"});
    }
    const user = await Data.findByIdAndDelete({_id : id});
    if(!user){
      res.status.json({message : "user not found"})
    }
    return res.status(200).json({sucess : "user deleted Successfully"});
  } catch (error) {
    console.log(error);
    return res.status(400).json({error});
  }
}



module.exports = {
  UserRegister,
  ConformRegistration,
  Login,
  ConformLogin,
  getProfile,
  forgetPassword,
  LogoutUsingCooke,
  resetPassword,
  GetProfileById,
  UpdateUserProfile,
  DeleteUserAccount
};
