const jwt = require('jsonwebtoken');
require('dotenv').config();

// Token verification function
const jwtauthmiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log("Authorization Header:", authHeader); // Debugging
  
    const token = authHeader?.split(' ')[1]; // Extracting the token using optional chaining
    if (!token) {
      console.log("No token provided"); // Debugging
      return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRETKEY);
      console.log("Decoded Token:", decode); // Debugging
      req.user = decode; // Attach the decoded user information to the request
      next();
    } catch (err) {
      console.log("Token verification failed:", err); // Debugging
      res.status(401).json({ error: 'Invalid Token' });
    }
  };
  

// Function to generate token
const generateToken = (userData) => {
  return jwt.sign(userData, process.env.JWT_SECRETKEY,{expiresIn:'1h'});
};

// Export the functions
module.exports = {
  generateToken,
  jwtauthmiddleware
};
