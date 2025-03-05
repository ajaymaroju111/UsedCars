const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Data = require("../Models/UserSchema.js");
const Meta = require("../Models/IdsAndMails.js");
const session = require("../Models/UserSession.js");
const { sendEmail } = require("../Nodemailer/Mails.js");
const { CreateToken } = require("./Tokens/UserToken.js");
const { JoiUserregisterSchema,
  JoiLoginValidation,
  JoiForgetPassword } = require("../Joi/Joi.js");
const {
  forgetPasswordTemplate,
  AccountConformationafterRegister,
} = require("../Nodemailer/MailTemplates/Templates.js");

// User Registration :
const UserRegister = async (req, res) => {
  const { error } = JoiUserregisterSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ msg: error.details[0].message });
  }
  try {
    const { firstname, middlename, lastname, role, email, password, DOB, phone } =
      req.body;
    if (!email) {
      return res
        .status(401)
        .json({ error: "Email is required for the registration" });
    }
    //Search for the user in the DB :
    const isUser = await Data.findOne({ email });
    if (isUser) {
      return res
        .status(400)
        .json({ UserExist: "User already exist please login" });
    }
    const HashedPassword = (await bcrypt.hash(password, 10)).toString();
    const user = await Data.create({
      firstname,
      middlename,
      lastname,
      role,
      email,
      password: HashedPassword,
      DOB,
      phone,
    });
    await user.save();
    const FullName = `${user.firstname} ${user.middlename} ${user.lastname}`;
    await sendEmail({
      to: user.email,
      subject: "Account Conformation for UsedCars Platform",
      text: AccountConformationafterRegister(FullName),
    });
    return res
      .status(200)
      .json({ message: "user registration conformation has send to the email !!  Please Verify" });
  } catch (error) {
    console.log(`registration error : ${error}`);
    return res.status(500).json({ RegistrationError: error });
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
      return res.status(400).json({ IncorrectPassword: `incorrect password` });
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
    });
    Session.save();
    console.log({
      login: "user logged in Successfully",
      Cookie: true,
      status: 200,
    });
    return res
      .status(200)
      .json({ Sucess: "User Loggedin Successfully !!" });
  } catch (error) {
    console.log(`logon error : ${error}`);
    return res.status(500).json({
      LoginError: error,
    });
  }
};

//user logout :
const LogoutUsingCooke = async (req, res) => {
  try {
    const {token} = req.cookies;
    if (!token) {
      return res.status(401).json({ invaliToken: "invalid Token" });
    }
    console.log(token);
    const decode = jwt.verify(token , process.env.JWT_SECRET);
    if(!decode){
      return res.status(401).json({NotValid : "token is not Correct"})
    }
    await session.deleteMany({ userToken : token });
    console.log("user sessions data is deleted");
    res.clearCookie("token"); // Clear the authentication token
    res.json({ message: "User logged out successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ LogoutError: error });
  }
};

//get user profile by ID :
const getProfile = async (req, res) => {
  try {
    const {id , token} = req.cookies;
    if (!id) {
      return res.status(401).json({ IdNotFound: "id not found in the token" });
    }
    const decode = jwt.verify(token , process.env.JWT_SECRET);
    if(!decode){
      return res.status(400).json({NotValid : "token is not valid"})
    }
    const UserSess = await Data.findById({id});
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
    return res.status(500).json({ forgetPassword: error });
  }
};

//user reset password :  No Authentication required
const resetPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const {id} = req.cookies;
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
    const UserSess = await session.findOne({ userId: id });
    if (Date.now() > UserSess.tokenExpiresIn) {
      await UserSess.findByIdAndDelete({userId: id});
      await UserSess.save();
      console.log("logs deleted successfully");
      res.status(400).json({ Expired: "Session expired please login" });
    }
    const user = await Data.findOne({ id });
    if (!user) {
      return res.status(404).json({ userNotFound: "user did not found" });
    }
    const isPass = await bcrypt.compare(oldPassword, user.password);
    if (!isPass) {
      return res
        .status(400)
        .json({ PasswordDoesnotMatch: "old password doesnot match" });
    }
    const newHashedpassword = bcrypt.hash(newPassword, 10);
    user.password = newHashedpassword;
    await user.save();
    return rs.status(200).json({ sucessfull: "password updated Successfully" });
  } catch (error) {
    return res.status(500).json({ error: error });
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
      return res.status(404).json({message : "user does not exist"});
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
    return res.status(500).json({error : error});
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
      res.status(404).json({message : "user not found"});
    }
    return res.status(200).json({sucess : "user deleted Successfully"});
  } catch (error) {
    console.log(error);
    return res.status(400).json({error});
  }
}



module.exports = {
  UserRegister,
  Login,
  getProfile,
  forgetPassword,
  LogoutUsingCooke,
  resetPassword,
  GetProfileById,
  UpdateUserProfile,
  DeleteUserAccount
};
