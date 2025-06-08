// src/utils/logger.js
const LogLevel = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG',
};

const log = (level, message, details = null) => {
  const timestamp = new Date().toISOString();
  let logMessage = `${timestamp} [${level}] - ${message}`;

  if (details) {
    try {
      logMessage += ` | Details: ${JSON.stringify(details, null, 2)}`;
    } catch (e) {
      logMessage += ` | Details: (Error serializing details: ${e.message})`;
    }
  }

  // Output to console (Render and other platforms typically capture this)
  if (level === LogLevel.ERROR) {
    console.error(logMessage);
  } else if (level === LogLevel.WARN) {
    console.warn(logMessage);
  } else {
    console.log(logMessage);
  }
};

const logger = {
  error: (message, details = null) => log(LogLevel.ERROR, message, details),
  warn: (message, details = null) => log(LogLevel.WARN, message, details),
  info: (message, details = null) => log(LogLevel.INFO, message, details),
  debug: (message, details = null) => {
    // Simple debug logging: only log if NODE_ENV is 'development' or DEBUG is true
    if (process.env.NODE_ENV === 'development' || process.env.DEBUG === 'true') {
      log(LogLevel.DEBUG, message, details);
    }
  },
};

module.exports = logger;
