const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Data = require("../Models/UserSchema.js");
const Meta = require("../Models/IdsAndMails.js");
const session = require("../Models/UserSession.js");
const { sendEmail } = require("../Nodemailer/Mails.js");
const { CreateToken } = require("./Tokens/UserToken.js");
const {
  JoiUserregisterSchema,
  JoiLoginValidation,
  JoiForgetPassword,
  JoiResetPassword,
  JoiUpdateProfile
} = require("../Joi/Joi.js");
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
    const {
      firstname,
      middlename,
      lastname,
      email,
      password,
      DOB,
      phone,
    } = req.body;
    if (!email) {
      return res
        .status(401)
        .json({ error: "Email is required for the registration" });
    }
    //Search for the user in the DB :
    const isUser = await Data.findOne({ email });
    if (isUser) {
      return res
        .status(404)
        .json({ UserExist: "User already exist please login" });
    }
    const HashedPassword = await bcrypt.hash(password, 10);
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const user = await Data.create({
      profileImage: {
        name: req.file.originalname,
        img: {
          data: req.file.buffer, // Store buffer data
          contentType: req.file.mimetype,
        },
      },
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
    await sendEmail({
      to: user.email,
      subject: "Account Conformation for UsedCars Platform",
      text: AccountConformationafterRegister(FullName),
    });
    //user meta data :
    const meta = await Meta.create({
      id: user._id,
      email: user.email,
    });
    await meta.save();
    //Status Change after the email verification :
    user.status = "active";
    await user.save();
    return res
      .status(200)
      .json({
        message:
          "user registration conformation has send to the email !!  Please Verify",
      });
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
        .json({ UserNotExist: "user does not exist!!.. please register" });
    }
    //compare the password :
    const isPass = await bcrypt.compare(password, user.password);
    if (!isPass) {
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
    return res.status(200).json({ Success: "User Logged in Successfully !!" });
  } catch (error) {
    console.log(`login error : ${error}`);
    return res.status(500).json({
      LoginError: error,
    });
  }
};

//user logout :
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
    await session.deleteMany({ userToken: token });
    console.log("user sessions data is deleted");
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
    const user = await Data.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ UserNotFound: "User not found please register" });
    }
    if (user.status === "inactive") {
      return res
        .status(401)
        .json({ message: "user is not active please verify the email" });
    }
    res.status(200).json(user.toObject());
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: `NotGettingProfile ${error}` });
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
      return res.status(404).json({ NoUserExist: "User does not Exist" });
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
  const { error } = JoiResetPassword.validate(req.body);
  if (error) {
    return res.status(400).json({ msg: error.details[0].message });
  }
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
    const user = await Data.findById(id);
    if (!user) {
      return res.status(404).json({ userNotFound: "user did not found" });
    }
    const isPass = await bcrypt.compare(oldPassword, user.password);
    if (!isPass) {
      return res
        .status(400)
        .json({ PasswordDoesnotMatch: "old password does not match" });
    }
    const newHashedpassword = await bcrypt.hash(newPassword, 10);
    user.password = newHashedpassword;
    await user.save();
    return res.status(200).json({ successful: "password updated Successfully" });
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
    const user = await Data.findById(id);
    if (!user) {
      return res.status(404).json({ invalid: "User not found" });
    }
    return res.status(200).json(user.toObject());
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

//update user profile based on cookie :
const UpdateUserProfile = async (req, res) => {
  const { error } = JoiUpdateProfile.validate(req.body);
  if (error) {
    return res.status(400).json({ msg: error.details[0].message });
  }
  const { token } = req.cookies;
  const { email, password } = req.body;
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
    if (email) {
      user.email = email;
    }
    if (password) {
      const hashedPass = await bcrypt.hash(password, 10);
      user.password = hashedPass;
    }
    await user.save();
    console.log("user updated Successfully");
    return res.status(200).json(user.toObject());
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
    const userMeta = await Meta.findOneAndDelete({ id });
    if (!userMeta) {
      return res.status(404).json({ message: "user not found" });
    }
    const user = await Data.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    return res.status(200).json({ success: "user deleted Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
};

module.exports = {
  UserRegister,
  Login,
  getProfile,
  forgetPassword,
  LogoutUsingCookie,
  resetPassword,
  GetProfileById,
  UpdateUserProfile,
  DeleteUserAccount,
};
