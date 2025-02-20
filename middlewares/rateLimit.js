const rateLimit = require("express-rate-limit");

const apiLimiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 5,
  message: {
    success: false,
    "error": "Too many requests",
    "message": "You have exceeded the request limit. Please wait and try again in a few minutes.",
    "retry_after_seconds": 60
  },
  headers: true, 
});


module.exports = {apiLimiter};