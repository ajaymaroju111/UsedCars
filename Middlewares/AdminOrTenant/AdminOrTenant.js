const jwt = require("jsonwebtoken");
require("dotenv").config();
const TenantsData = require("../../Models/Tenants/TenantsSchema");


const isAdminOrTenant = async(req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return res
      .status(401)
      .json({ error: "token in not found or expired please login" });
  }
  try {
    // eslint-disable-next-line no-undef
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    if (!decode) {
      return res.status(401).json({ error: "user Authentication failed " });
    }
    const id = decode.id;
    if (!id) {
      return res.status(400).json({ error: "ID not found" });
    }
    const user = await TenantsData.findById(id);
    if(!user){
      return res.status(404).json({error: "No user found with this ID"});
    } 
    if (user.role !== "admin" && user.role !== "tenant") {
      return res.status(401).json({ error: "you are not authorized" });
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
};

module.exports = isAdminOrTenant;