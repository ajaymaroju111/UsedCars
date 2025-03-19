const mongoose = require('mongoose');

const UserSessionSchema = new mongoose.Schema({
  useremail: {
    type : String,
  },
  userId : {
    type : String,
  },
  VerifyToken : {
    type : String,
  },
  tokenExpiresIn : {
    type : Date,
  },
  expiryTime : {
    type : Date
  }
})

module.exports = mongoose.model('sessions' , UserSessionSchema);