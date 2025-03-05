const mongoose = require('mongoose');

const TenantsSchema = new mongoose.Schema({
  profileImage : {
    name: String,
    img: {
        data: Buffer, // Binary image data
        contentType: String // Image type (jpeg/png)
    }

  },
  username : {
    type : String,
    required : true,
  },
  aadhar : {
    type : String,
    required : true
  },
  email : {
    type : String,
    required : true,
  },
  business : {
    type : String,
    required : true
  },
  password : {
    type : String,
    required : true
  }
  ,
  phone : {
    type : Number,
    minlength: [10, "Password must be at least 8 characters long"],
    maxlength : 10,
    required : true,
  },
  Address : {
    type : String,
    required : true
  },
  status : {
    type : String,
    enum : ['active' , 'inactive'],
    default : 'active',
  }
},{timestamps: true});

module.exports = mongoose.model('TenantsData', TenantsSchema);