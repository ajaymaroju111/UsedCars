const express = require('express');
const router = express.Router();
//using the multer for the image uploading :
const upload = require("../Middlewares/multer.js");
const cookieParser = require('cookie-parser');
const {
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
} = require('../Controllers/users/Authentication.js');
const {verifyUserUsingCookie} = require('../Middlewares/verifyUser.js');
router.use(cookieParser());

//phase - 1 :
router.route('/register').post( upload.single('image') ,UserRegister);
router.route('/conform').post(ConformUserRegister);
router.route('/login').post(Login);
router.route('/logout').post(LogoutUsingCookie);
router.route('/me').get(verifyUserUsingCookie ,getProfile);
router.route('/forget-password').post(forgetPassword);
router.route('/reset-password').post(verifyUserUsingCookie ,resetPassword);
router.route('/:id').get(verifyUserUsingCookie ,GetProfileById).put(verifyUserUsingCookie ,UpdateUserProfile).delete(verifyUserUsingCookie ,DeleteUserAccount);

























































































module.exports = router


