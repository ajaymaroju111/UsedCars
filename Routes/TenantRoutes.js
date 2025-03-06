const express = require('express');
const router = express.Router();
//using the multer for the image uploading :
const upload = require("../Multer/multer.js");
const cookieParser = require('cookie-parser');
const {
  TenantRegister,
  GetTenantProfileById,
  UpdateTenantProfile,
  DeleteTenantAccount
} = require("../Middlewares/TenantAuth.js");
router.use(cookieParser());



//Routes for tenants : 
router.post('/' , upload.single('image'),TenantRegister);
router.get('/:id' ,GetTenantProfileById);
router.put('/:id' ,UpdateTenantProfile);
router.delete('/:id' ,DeleteTenantAccount);



module.exports = router