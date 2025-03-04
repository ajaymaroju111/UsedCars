const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const TenantsData = require('../Models/Tenants/TenantsSchema.js');
const { sendEmail } = require("../Nodemailer/Mails.js");
const {JoiTenantRegisterSchema,
  JoiTenantConformRegister,

} = require('../Joi/Joi.js');
const {
  registerOtpTemplate,
  AfterConformRegisterEmail,
} = require("../Nodemailer/MailTemplates/Templates.js");
const TenantsMeta = require('../Models/Tenants/TenantsMeta.js');

const TenantRegister = async (req, res) => {
  const { error } = JoiTenantRegisterSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ msg: error.details[0].message });
  }
  try {
    const { username, TenentId, email, password, phone, Address } =
      req.body;
    if (!email || !TenentId || !username || !password || !phone) {
      return res
        .status(400)
        .json({ error: "All fields is required for the registration" });
    }
    //Search for the user in the DB :
    const isUser = await TenantsData.findOne({email});
    if (isUser) {
      return res
        .status(201)
        .json({ UserExist: "User already exist please login" });
    }
    const HashedPassword = (await bcrypt.hash(password, 10)).toString();
    const Tentuser = await TenantsData.create({
      username,
      TenentId,
      email,
      password: HashedPassword,
      phone,
      Address,
    });
    await Tentuser.save();
    const registerOTP = Math.floor(100000 + Math.random() * 900000).toString();
    await sendEmail({
      to: Tentuser.email,
      subject: "OTP verification for registration process of UsedCars",
      text: registerOtpTemplate(Tentuser.username, registerOTP),
    });
    Tentuser.expiresTime = Date.now() + 10 * 60 * 1000;
    const hashedOTP = await bcrypt.hash(registerOTP, 10);
    Tentuser.otp = hashedOTP;
    await Tentuser.save();
    return res
      .status(200)
      .json({ message: "User registered and OTP has send to the email" });
  } catch (error) {
    console.log(`registration error : ${error}`);
    return res.status(400).json({ RegistrationError: error });
  }
};

//conform tenents registration using otp : 
const ConformTenantRegistration = async (req, res) => {
  const { error } = JoiTenantConformRegister.validate(req.body);
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
    const Tentuser = await TenantsData.findOne({ email });
    if (!Tentuser) {
      return res.status(400).json({ UserNotFound: "incorrect email" });
    }
    if (Date.now() > Tentuser.expiresTime) {
      return res.status(400).json({ expired: "OPT is expired" });
    }
    const MatchOtp = bcrypt.compare(otp, Tentuser.otp);
    if (!MatchOtp) {
      returnres.status(400).json({ NoMatch: "OTP does not match" });
    }
    const TenantMeta = await TenantsMeta.create({
      id: Tentuser._id,
      email: Tentuser.email,
    });
    await TenantMeta.save();
    Tentuser.expiresTime = undefined; //free the otp variable :
    //send the successfull message :
    await sendEmail({
      to: Tentuser.email,
      subject: "Welcome to the UsedCars Platform",
      text: AfterConformRegisterEmail(Tentuser.username),
    });
    Tentuser.otp = undefined;
    await Tentuser.save();
    return res
      .status(200)
      .json({ sucess: "user registration conformed successfully" });
  } catch (error) {
    console.log(` registration conformation error : ${error}`);
  }
};

//get tenants profile account by cookies : 
const GetTenantProfileById = async (req, res) => {
  try {
    // const {id} = req.cookie.userId;
    const id = req.body;
    if (!id) {
      return res.status(401).json({ IdNotFound: "id not found in the token" });
    }
    // const UserSess = await session.findOne({ id });
    // if (!UserSess) {
    //   return res.status(401).json({ invaid: "invalid Id OR Token" });
    // }
    // if (Date.now() > UserSess.tokenExpiresIn) {
    //   await UserSess.deleteMany({ id });
    //   await UserSess.save();
    //   console.log("logs deleted successfully");
    //   return res.status(401).json({ Expired: "token Session expired" });
    // }
    const user = await TenantsData.findOne({ id });
    if (!user) {
      return res.status(401).json({ invaid: "invalid Id OR Token" });
    }
    return res.json({ user });
  } catch (error) {
    return res.json({ error: error });
  }
};

//update tenents profile based on cookie : 
const UpdateTenantProfile = async(req , res) =>{
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
    const user = await TenantsData.findById({userId : id});
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

//Delete Tenants account based on the cookie : 
const DeleteTenantAccount = async(req , res) =>{
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
    const user = await TenantsData.findByIdAndDelete({_id : id});
    if(!user){
      res.status.json({message : "user not found"})
    }
    return res.status(200).json({sucess : "user deleted Successfully"});
  } catch (error) {
    console.log(error);
    return res.status(400).json({error});
  }
}


module.exports = {TenantRegister, ConformTenantRegistration, GetTenantProfileById, UpdateTenantProfile, DeleteTenantAccount}