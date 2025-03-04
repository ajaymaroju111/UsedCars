const mongoose = require('mongoose');

const UserIdandEmailSchemas = new mongoose.Schema({
  id : {
    type : String,
  },
  email : {
    type : String,
  }
});


module.exports = mongoose.model('TenantsMeta' , UserIdandEmailSchemas)