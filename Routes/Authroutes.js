const express = require('express');
const router = express.Router();

const upload = require("../Middlewares/multer.js");
const cookieParser = require('cookie-parser');
const {
  signUpUser,
  ConformUserAccount,
  loginUser,
  getUserProfile,
  forgetPassword,
  LogoutUser,
  resetPassword,
  getProfileById,
  UpdateProfile,
  deleteProfile,
} = require('../Controllers/users/Authentication.js');
const {verifyUserUsingCookie} = require('../Middlewares/verifyUser.js');
router.use(cookieParser());

//phase - 1 :
router.route('/register').post( upload.single('image') ,signUpUser);
router.route('/conform').post(ConformUserAccount);
router.route('/login').post(loginUser);
router.route('/logout').post(LogoutUser);
router.route('/me').get(verifyUserUsingCookie ,getUserProfile);
router.route('/forget-password').post(forgetPassword);
router.route('/reset-password').post(verifyUserUsingCookie ,resetPassword);
router.route('/:id').get(verifyUserUsingCookie ,getProfileById).put(verifyUserUsingCookie ,UpdateProfile).delete(verifyUserUsingCookie ,deleteProfile);

























































































module.exports = router


