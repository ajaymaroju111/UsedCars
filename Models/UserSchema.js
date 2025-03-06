const e = require('express');
const mongoose = require('mongoose');

const userData = new mongoose.Schema({
  profileImage : {
    name: String,
    img: {
        data: Buffer, // Binary image data
        contentType: String // Image type (jpeg/png)
    }
  },
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
   type : String,
    required : true,
  },
  phone : {
    type : Number,
  },
  status : {
    type : String,
    enum : ['active' , 'inactive'],
    default : 'active',
  }
} , {timestamps : true });

module.exports = mongoose.model('Data' , userData);