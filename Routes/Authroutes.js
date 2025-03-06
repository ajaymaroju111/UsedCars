const express = require('express');
const router = express.Router();
//using the multer for the image uploading :
const upload = require("../Multer/multer.js");
const cookieParser = require('cookie-parser');
const {UserRegister,
  Login,
  getProfile,
  forgetPassword,
  LogoutUsingCooke,
  resetPassword,
  GetProfileById,
  UpdateUserProfile,
  DeleteUserAccount,
} = require('../Middlewares/Authentication.js');

router.use(cookieParser());

//phase - 1 : 
router.post('/register', upload.single('image') ,UserRegister);
router.post('/login' ,Login);
router.post('/logout' ,LogoutUsingCooke);
router.get('/me' ,getProfile);
router.post('/forget-password' ,forgetPassword);
router.post('/reset-password' ,resetPassword);
router.get('/:id' ,GetProfileById);
router.put('/:id' ,UpdateUserProfile);
router.delete('/:id' ,DeleteUserAccount);

























































































module.exports = router


