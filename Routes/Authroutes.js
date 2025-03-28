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
  userPosts,
  sendMessage,
  userNotifications,
  readMessages,
} = require('../Controllers/users/Authentication.js');
const {verifyUser} = require('../Middlewares/verifyUser.js');
router.use(cookieParser());

//phase - 1 :
router.route('/register').post( upload.single('image') ,signUpUser);
router.route('/conform').post(ConformUserAccount);
router.route('/login').post(loginUser);
router.route('/logout').post(LogoutUser);
router.route('/me').get(verifyUser ,getUserProfile);
router.route('/forget-password').post(forgetPassword);
router.route('/reset-password').post(verifyUser ,resetPassword);
router.route('/allposts').get(verifyUser, userPosts);
router.route('/messages').post(verifyUser, sendMessage).get(verifyUser, userNotifications).put(verifyUser, readMessages);
router.route('/:id').get(verifyUser ,getProfileById).put(verifyUser ,UpdateProfile).delete(verifyUser ,deleteProfile);

module.exports = router;

























































































module.exports = router


