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
  expiryTime : {
    type : Date
  }
},{
  timestamps : true,
  timeseries : true
})

module.exports = mongoose.model('sessions' , UserSessionSchema);