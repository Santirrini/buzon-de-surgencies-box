// src/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendErrorResponse = require('../utils/errorHandler');
const logger = require('../utils/logger'); // Import logger
const ADMIN_PASSWORD_HASH = bcrypt.hashSync(process.env.ADMIN_PASSWORD, 8);

exports.login = async (req, res) => {
  const { password, email } = req.body; // Assuming email might be part of the body for logging

  if (!password) {
    return sendErrorResponse(res, 400, 'Password is required.');
  }

  try {
    const isPasswordValid = bcrypt.compareSync(password, ADMIN_PASSWORD_HASH);

    if (!isPasswordValid) {
      return sendErrorResponse(res, 401, 'Invalid credentials.');
    }

    const token = jwt.sign({ id: 'admin' }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    });

    res.status(200).json({ token });
  } catch (error) {
    // console.error('Login error:', error);
    logger.error('Login error', { message: error.message, stack: error.stack, email: email }); // Added email for context
    sendErrorResponse(res, 500, 'An internal server error occurred during login.');
  }
};

exports.logout = (req, res) => {
  logger.info('Logout successful for admin user.'); // Optional: log successful logout
  res.status(200).json({ message: 'Logout successful. Please clear your token on the client-side.' });
};
