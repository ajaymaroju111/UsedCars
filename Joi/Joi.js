const Joi = require('joi');

//user registration validation : 
const JoiUserregisterSchema = Joi.object({
  firstname: Joi.string().min(2).required(),
  middlename: Joi.string(),
  lastname: Joi.string().min(2).required(),
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
  password: Joi.string().min(6).required().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
  DOB: Joi.object({
    day: Joi.number().integer().min(0).max(31).required(),  
    month: Joi.number().integer().min(0).max(12).integer(),  
    year: Joi.number().integer().min(1900).max(2024).required(),
  }),
  phone: Joi.number().integer().required(),
});

//conform register validation : 
const JoiConformRegister = Joi.object({
  email : Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
  otp : Joi.number().integer().required(),
});

//login validation : 
const JoiLoginValidation = Joi.object({
  email : Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
  password : Joi.string().min(6).required().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
});

//conform login validation : 
const JoiConformLogin = Joi.object({
  email : Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
  otp : Joi.number().integer().required(),
});

//forget Password Validation : 
const JoiForgetPassword = Joi.object({
  email : Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
});

//reset password validation : 
const JoiResetPassword = Joi.object({
  oldPassword : Joi.string().min(6).required().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
  newPassword : Joi.string().min(6).required().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).invalid(Joi.ref('oldPassword')),
});

///--------------------------------------------------------------------------------------------------------------------------------------------------

//tenants register validation : 
const JoiTenantRegisterSchema = Joi.object({
  username: Joi.string().min(2).required(),
  TenentId : Joi.string().required(),
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
  password: Joi.string().min(6).required().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
  phone: Joi.number().integer().required(),
  Address : Joi.string().min(5).required(),
});

//conform registration validation : 
const JoiTenantConformRegister = Joi.object({
  email : Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
  otp : Joi.string().min(4).required(),
});

module.exports = {JoiUserregisterSchema, JoiConformRegister, JoiLoginValidation, JoiConformLogin, JoiForgetPassword, JoiResetPassword}
module.exports = {JoiTenantRegisterSchema, JoiTenantConformRegister}
