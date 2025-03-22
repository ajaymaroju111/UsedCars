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
} = require('../Controllers/Authentication.js');
const {VerifyUserUsingCookie} = require('../Middlewares/verifyUser.js');
router.use(cookieParser());

//phase - 1 :
router.post('/register', upload.single('image') ,UserRegister);
router.post('/conform', ConformUserRegister);
router.post('/login' ,Login);
router.post('/logout' ,LogoutUsingCookie);
router.get('/me', VerifyUserUsingCookie ,getProfile);
router.post('/forget-password', VerifyUserUsingCookie ,forgetPassword);
router.post('/reset-password', VerifyUserUsingCookie ,resetPassword);
router.get('/:id', VerifyUserUsingCookie ,GetProfileById);
router.put('/:id', VerifyUserUsingCookie ,UpdateUserProfile);
router.delete('/:id' , VerifyUserUsingCookie ,DeleteUserAccount);

























































































module.exports = router


