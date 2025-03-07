const mongoose = require('mongoose');
const { Buffer } = require('buffer');

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
    default : '',
  },
  lastname : {
    type : String,
    required : true,
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
    type : String,
  },
  status : {
    type : String,
    enum : ['active' , 'inactive'],
    default : 'active',
  }
} , {timestamps : true });

module.exports = mongoose.model('Data' , userData);