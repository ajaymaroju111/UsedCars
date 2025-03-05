const isAdminOrTenant = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return res
      .status(401)
      .json({ error: "token in not found or expired please login" });
  }
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    if (!decode) {
      return res.status(401).json({ error: "user Authentication failed " });
    }
    if (decode.role !== "admin" || decode.role !== "tenant") {
      return res.status(401).json({ error: "you are not authorized" });
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
};

module.exports = isAdminOrTenant;