const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']; // Must be lowercase 'authorization'

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Check for role and default to 'User' if missing
    if (!decoded.role) decoded.role = 'User';
    req.user = decoded;

    // Optional: Enforce 15-minute session (requires token refresh logic)
    const issuedAt = decoded.iat * 1000; // Convert to ms
    const fifteenMinutesAgo = Date.now() - 15 * 60 * 1000;
    if (issuedAt < fifteenMinutesAgo) {
      return res.status(401).json({ message: "Session expired" });
    }

    next();
  } catch (error) {
    console.error("❌ Token verification failed:", error);
    return res.status(403).json({ message: "Forbidden: Invalid token" });
  }
};

module.exports = authenticateToken;