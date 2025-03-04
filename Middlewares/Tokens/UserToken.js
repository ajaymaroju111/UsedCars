const jwt = require('jsonwebtoken');
require('dotenv').config();

const CreateToken = (user) =>{
  try {
    const data = {
      id: user._id,
      email: user.email
    };
    
    const key = process.env.JWT_SECRET;
    const expiry = { expiresIn: '1h' };
    return jwt.sign(data, key, expiry);
  } catch (error) {
    console.log(` token creation error : ${error}`)
  }
}

module.exports = {CreateToken}