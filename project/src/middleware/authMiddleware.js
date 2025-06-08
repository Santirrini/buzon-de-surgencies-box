// src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const sendErrorResponse = require('../utils/errorHandler'); // Import

const verifyToken = (req, res, next) => {
  let token = req.headers['authorization'];

  if (!token) {
    return sendErrorResponse(res, 403, 'No token provided.');
  }

  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length);
  } else {
    return sendErrorResponse(res, 401, 'Token format is invalid. Expected "Bearer <token>".');
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return sendErrorResponse(res, 401, 'Unauthorized! Token has expired.');
      }
      return sendErrorResponse(res, 401, 'Unauthorized! Invalid token.');
    }
    req.userId = decoded.id;
    next();
  });
};

module.exports = verifyToken;
