const e = require('express');
const mongoose = require('mongoose');

const userData = new mongoose.Schema({
  firstname : {
    type : String,
    required : true,
  },
  middlename : {
    type : String,
  },
  lastname : {
    type : String,
    required : true,
  },
  role : {
    type : String,
    enum : ['admin' , 'user' , 'tenant'],
    default : 'user',
  },
  email : {
    type : String,
    required : true,
  },
  password : {
    type : String,
    required : true,
  },
  DOB: {
    day: {
      type: Number
    },
    month: {
      type: Number
    },
    year: {
      type: Number
    },
  },
  phone : {
    type : Number,
  },
  status : {
    type : String,
    enum : ['active' , 'inactive'],
    default : 'active',
  },
  otp : {
    type : String,
    required : false,
  },
  expiryTime : {
    type : Date,
    required : false,
  }
});

module.exports = mongoose.model('Data' , userData);