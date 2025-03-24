const dotenv = require('dotenv').config();
const Users = require('../Models/UserSchema.js');


const restrictAdminUsers = async(req , res , next) =>{
  try {
    const users = await Users.find({account_type : 'admin'}).sort({ createdAt: 1 }).skip(process.env.ADMIN_ACCOUNTS_LIMIT);
     const response = {
      users: users.map(user => `Hello, ${user.fullname}! you are not authorized for this only two accounts should have admin access`),
    };
    next();
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error : "Internal Server Error"
    })
  }
}

module.exports = {restrictAdminUsers}