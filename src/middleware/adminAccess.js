// adminMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/user/user'); // Import your Mongoose user model
const {  jwtSecret } = require("../config/setting");
async function adminMiddleware(req, res, next) {
  // Check if the user has a Bearer token in the Authorization header
  const token = req.headers.authorization;
  if (!token || !token.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const tokenValue = token.split(' ')[1];

  try {
    // Decode the token to get the user's ID
    const decoded = jwt.verify(tokenValue, jwtSecret); // Replace with your secret key

    // Query the user document in MongoDB
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Check the user's role
    if (user.role === 'admin') {
      // User has admin privileges, so continue to the next middleware/route
      next();
    } else {
      // User is not an admin, so send a forbidden response
      res.status(403).json({ message: 'Permission denied' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

module.exports = adminMiddleware;
