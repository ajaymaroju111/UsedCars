const mongoose = require('mongoose');

const UserIdandEmailSchema = new mongoose.Schema({
  id : {
    type : String,
  },
  email : {
    type : String,
  }
});


module.exports = mongoose.model('Meta' , UserIdandEmailSchema)