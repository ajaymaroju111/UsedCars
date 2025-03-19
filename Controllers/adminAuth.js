const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const users = require("../Models/UserSchema.js");
dotenv.config();
const Cars = require("../Models/CarsSchema.js");


const SetInactiveAccount = async(req , res) =>{
  try {
     const { token } = req.cookies;
     const targetId = req.paramas;
     if(!targetId){
      return res.status(401).json({
        message : "no user id is passed"
      });
     }
      if (!token) {
        return res
          .status(401)
          .json({ error: "Token not found or expired, please login" });
      }
      const decode = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
      if (!decode) {
        return res.status(401).json({ error: "User authentication failed" });
      }
      const id = decode.id;
      if (!id) {
        return res.status(400).json({ error: "ID not found" });
      }
      const isUser = await users.findById(id);
      if (!isUser) {
        return res.status(404).json({ error: "User not found" });
      }
      if (!(isUser.status === "active")) {
        return res.status(401).json({ error: "User is inactive" });
      }
      if(!(isUser.account_type === 'admin')){
        return res.status(401).json({
          message : "you are not authorized for this"
        });
      }
      const target = await users.findById(targetId);
      if(!target){
        return res.status(401).json({
          message :"no target user found on the ID"
        });
      }
      target.status === 'inactive'
      await target.save();
      return res.status(200).json({
        message :"Account sattus set to be INACTIVE Succesfully"
      });
  } catch (error) {
    console.log(error);
    return res.status({
      error : "internal server error"
    });
  }
}

module.exports = {
  SetInactiveAccount,

}