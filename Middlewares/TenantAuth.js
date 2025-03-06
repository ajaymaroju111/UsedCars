const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const TenantsData = require('../Models/Tenants/TenantsSchema.js');
const { sendEmail } = require("../Nodemailer/Mails.js");
const {JoiTenantRegisterSchema} = require('../Joi/Joi.js');
const {
  AfterConformRegisterEmail,
} = require("../Nodemailer/MailTemplates/Templates.js");
const TenantsMeta = require('../Models/Tenants/TenantsMeta.js');

//tenants registration : 
const TenantRegister = async (req, res) => {
  const { error } = JoiTenantRegisterSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ msg: error.details[0].message });
  }
  try { 
    const { profileImage, username, aadhar, email, business, password, phone, Address, TenantId } = req.body;
    if (!profileImage || !email || !TenantId || !username || !password || !phone) {
      return res
        .status(400)
        .json({ error: "All fields are required for the registration" });
    }

    //Search for the user in the DB :
    const isUser = await TenantsData.findOne({ email });
    if (isUser) {
      return res
        .status(201)
        .json({ UserExist: "User already exists, please login" });
    }
    const HashedPassword = await bcrypt.hash(password, 10);
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const Tentuser = await TenantsData.create({
      profileImage: {
        name: req.file.originalname,
        img: {
          data: req.file.buffer, // Store buffer data
          contentType: req.file.mimetype
        }
      },
      username,
      aadhar,
      email,
      business,
      password: HashedPassword,
      phone,
      Address,
    });
    await Tentuser.save();
    const TenantMeta = await TenantsMeta.create({
      id: Tentuser._id,
      email: Tentuser.email,
    });
    await TenantMeta.save();
    //send the successful message :
    await sendEmail({
      to: Tentuser.email,
      subject: "Registration verification",
      text: AfterConformRegisterEmail(Tentuser.username),
    });
    console.log("email sent successfully");
    Tentuser.status = "active";
    await Tentuser.save();
    return res
      .status(200)
      .json({ message: "User registration verification has been sent to the mail!" });
  } catch (error) {
    console.log(`registration error : ${error}`);
    return res.status(500).json({ RegistrationError: error });
  }
};

//get tenants profile account by ID : 
const GetTenantProfileById = async (req, res) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ error: "token not found" });
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    if (!decode) {
      return res.status(401).json({ error: "Token Validation Error" });
    }
    const { id } = decode;
    if (!id) {
      return res.status(401).json({ IdNotFound: "id not found in the token" });
    }
    const user = await TenantsData.findById(id);
    if (!user) {
      return res.status(404).json({ userDoesNotExist: "User does not exist or token expired, please login" });
    }
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

//update tenants profile based on cookie : 
const UpdateTenantProfile = async (req, res) => {
  const { token } = req.cookies;
  const { oldpassword, password } = req.body;
  if (!token) {
    return res.status(401).json({ message: "cannot get a token from a cookie" });
  }
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    if (!decode) {
      return res.status(401).json({ NotValid: "token is not correct" });
    }
    const { id } = decode;
    if (!id) {
      return res.status(401).json({ error: "user ID could not get from a token" });
    }
    const user = await TenantsData.findById(id);
    if (!user) {
      return res.status(404).json({ message: "user does not exist, please register" });
    }
    const isPass = await bcrypt.compare(oldpassword, user.password);
    if (!isPass) {
      return res.status(404).json({ message: "password does not match" });
    }
    if (password) {
      const hashedPass = await bcrypt.hash(password, 10);
      user.password = hashedPass;
    }
    await user.save();
    console.log("user updated successfully");
    return res.status(200).json({ user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error });
  }
};

//Delete Tenants account based on the cookie : 
const DeleteTenantAccount = async (req, res) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(400).json({ message: "no token found from the cookie" });
  }
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    if (!decode) {
      return res.status(400).json({ message: "invalid token" });
    }
    const { id } = decode;
    if (!id) {
      res.status(400).json({ message: "user id not found in token" });
    }
    const user = await TenantsData.findByIdAndDelete(id);
    if (!user) {
      res.status(404).json({ message: "user not found, please register" });
    }
    const userMeta = await TenantsMeta.findByIdAndDelete(id);
    if (!userMeta) {
      res.status(404).json({ message: "user meta data not found" });
    }
    return res.status(200).json({ success: "user deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
};

module.exports = { TenantRegister, GetTenantProfileById, UpdateTenantProfile, DeleteTenantAccount };