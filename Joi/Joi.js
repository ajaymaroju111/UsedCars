const Joi = require('joi');

//user registration validation : 
const JoiUserregisterSchema = Joi.object({
  firstname: Joi.string().min(2).required(),
  middlename: Joi.string(),
  lastname: Joi.string().min(2).required(),
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
  password: Joi.string().min(6).required().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
  DOB: Joi.string().required(),
  phone: Joi.string().required(),
});

//login validation : 
const JoiLoginValidation = Joi.object({
  email : Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
  password : Joi.string().min(6).required().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
});

//conform login validation : 


//forget Password Validation : 
const JoiForgetPassword = Joi.object({
  email : Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
});

//reset password validation : 
const JoiResetPassword = Joi.object({
  oldPassword : Joi.string().min(6).required().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
  newPassword : Joi.string().min(6).required().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).invalid(Joi.ref('oldPassword')),
});

//update Profile validation : 
const JoiUpdateProfile = Joi.object({
  email : Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] }}),
  password : Joi.string().min(6).pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
});
///--------------------------------------------------------------------------------------------------------------------------------------------------

//tenants register validation : 
const JoiTenantRegisterSchema = Joi.object({
  username: Joi.string().min(2).required(),
  aadhar : Joi.string().required(),
  business : Joi.string().required(),
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
  password: Joi.string().min(6).required().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
  phone: Joi.number().integer().required(),
  Address : Joi.string().min(5).required(),
});

const JoiTenantUpdateProfile = Joi.object({
  oldPassword : Joi.string().min(6).required().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
  password : Joi.string().min(6).required().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).invalid(Joi.ref('oldPassword')),
});

module.exports = {JoiUserregisterSchema, JoiLoginValidation, JoiForgetPassword, JoiResetPassword, JoiUpdateProfile}
module.exports = {JoiTenantRegisterSchema, JoiTenantUpdateProfile}
