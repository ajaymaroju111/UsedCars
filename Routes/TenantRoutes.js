const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const {
  TenantRegister,
  ConformTenantRegistration,
  GetTenantProfileById,
  UpdateTenantProfile,
  DeleteTenantAccount
} = require("../Middlewares/TenantAuth.js");
router.use(cookieParser());



//Routes for tenants : 
router.post('/' ,TenantRegister);
router.post('/conform' ,ConformTenantRegistration);
router.get('/:id' ,GetTenantProfileById);
router.put('/:id' ,UpdateTenantProfile);
router.delete('/:id' ,DeleteTenantAccount);



module.exports = router