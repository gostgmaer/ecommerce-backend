
const { decodeToken } = require("../utils/helper");
async function createMiddleWare(req, res, next) {
  // Check if the user has a Bearer token in the Authorization header
  const token = req.headers.authorization;

  if (token && token.startsWith("Bearer ")) {
    const tokenValue = token.split(" ")[1];
    try {
      const decoded = await decodeToken(tokenValue);

      console.log(decoded)
      // Add user_id, created_by, and updated_by to the request body
      req.body["created_user_id"] = decoded.user_id; // Assuming 'id' contains user_id
      req.body["created_by"] = decoded.email; // You may customize this as needed
      req.body["updated_user_id"] = decoded.user_id; // Assuming 'id' contains user_id
      req.body["updated_by"] = decoded.email; // You may customize this as needed
    } catch (error) {
      console.error(error);
      // Handle invalid or expired tokens, but don't block the request
    }
  }

  // Continue to the next middleware/route
  next();
}

module.exports = createMiddleWare;
