const jwt = require("jsonwebtoken");

const isAuthenticated = (req, res, next) => {
  let token;
  if (req.session && req.session.user) {
    token = req.session.user.token;
  } else {
    token = req.cookies.token;
  }
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      return next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  }

  return res.status(401).json({ message: "Unauthorized, please log in" });
};

module.exports = { isAuthenticated };