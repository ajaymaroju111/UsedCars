const mongoose = require('mongoose');


const UserSessionSchema = new mongoose.Schema({
  userId : {
    type : String,
  },
  userToken : {
    type : String,
  },
  tokenExpiresIn : {
    type : Date,
  }
})

module.exports = mongoose.model('session' , UserSessionSchema);