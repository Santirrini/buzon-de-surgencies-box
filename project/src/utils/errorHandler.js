// src/utils/errorHandler.js
/**
 * Sends a structured JSON error response.
 * @param {object} res - Express response object.
 * @param {number} statusCode - HTTP status code.
 * @param {string} message - Main error message.
 * @param {object} [details] - Optional object for additional error details.
 */
const sendErrorResponse = (res, statusCode, message, details = null) => {
  const errorResponse = { message };
  if (details) {
    errorResponse.details = details;
  }
  res.status(statusCode).json(errorResponse);
};

module.exports = sendErrorResponse;
