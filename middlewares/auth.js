const jwt = require("jsonwebtoken");

const isAuthenticated = (req, res, next) => {
  let token;
  console.log(req.session, req.cookies);
  if (req.session && req.session.user) {
    // console.log("setting from session");
    token = req.session.user.token;
  } else if (req.cookies && req.cookies.token) {
    // console.log("setting from cookie");
    token = req.cookies.token;
  } else {
    // console.log("auth header");
    if (
      !req.headers.authorization.startsWith("Bearer") &&
      req.headers.authorization.split("Bearer ").length == 0
    ) {
      res.status(401).json({
        success: false,
        message: "Token Malformed",
      });
    } else {
      // console.log(req.headers.authorization.split("Bearer "));
      token = req.headers.authorization.split("Bearer ")[1];
    }
  }
  // console.log("<><>", { token });
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
