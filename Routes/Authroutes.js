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
router.post('/register', upload.single('image') ,UserRegister);
router.post('/conform', ConformUserRegister);
router.post('/login' ,Login);
router.post('/logout' ,LogoutUsingCookie);
router.get('/me', verifyUserUsingCookie ,getProfile);
router.post('/forget-password' ,forgetPassword);
router.post('/reset-password', verifyUserUsingCookie ,resetPassword);
router.get('/:id', verifyUserUsingCookie ,GetProfileById);
router.put('/:id', verifyUserUsingCookie ,UpdateUserProfile);
router.delete('/:id' , verifyUserUsingCookie ,DeleteUserAccount);

























































































module.exports = router


