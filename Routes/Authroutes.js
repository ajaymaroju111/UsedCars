const express = require('express');
const router = express.Router();
//using the multer for the image uploading :
const upload = require("../Middlewares/Multer/multer.js");
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

router.use(cookieParser());

//phase - 1 : 
router.post('/register', upload.single('image') ,UserRegister);
router.post('/conform', ConformUserRegister);
router.post('/login' ,Login);
router.post('/logout' ,LogoutUsingCookie);
router.get('/me' ,getProfile);
router.post('/forget-password' ,forgetPassword);
router.post('/reset-password' ,resetPassword);
router.get('/:id' ,GetProfileById);
router.put('/:id' ,UpdateUserProfile);
router.delete('/:id' ,DeleteUserAccount);

























































































module.exports = router


