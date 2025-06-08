// src/server.js
const express = require('express');
// require('dotenv').config(); // Should be in index.js

const authRoutes = require('./routes/authRoutes');
const suggestionRoutes = require('./routes/suggestionRoutes'); // Import suggestion routes
const sendErrorResponse = require('./utils/errorHandler'); // Import the utility
const cors = require('cors'); // Ensure cors is required
const logger = require('./src/utils/logger'); // Import logger

const app = express();

// CORS Configuration
const frontendUrl = process.env.FRONTEND_URL;
const allowedOrigins = [];
if (frontendUrl) {
  allowedOrigins.push(frontendUrl);
} else {
  // console.warn('WARNING: FRONTEND_URL is not set. CORS will be very restrictive or allow all if not handled carefully.');
  logger.warn('FRONTEND_URL is not set. CORS configuration might be too restrictive or too open if not handled carefully in development.');
}

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.length === 0 && !frontendUrl) {
        return callback(new Error('Not allowed by CORS: FRONTEND_URL not configured.'));
    }

    if (allowedOrigins.includes('*')) {
        return callback(null, true);
    }

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // console.error(`CORS Error: Origin ${origin} not allowed.`); // Replaced by logger in origin function if error is passed to callback
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/suggestions', suggestionRoutes);

app.get('/', (req, res) => {
  res.send('Suggestion Box Backend is running!');
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  // console.error("Global error handler caught:", err);
  logger.error('Global error handler caught an unhandled error', {
    message: err.message,
    stack: err.stack,
    statusCode: err.statusCode,
    details: err.details,
    path: req.path,
    method: req.method
  });

  const statusCode = err.statusCode || 500;
  const message = err.message || 'An unexpected internal server error occurred.';
  const details = err.details || null;

  sendErrorResponse(res, statusCode, message, details); // sendErrorResponse remains for HTTP response
});

module.exports = app;
