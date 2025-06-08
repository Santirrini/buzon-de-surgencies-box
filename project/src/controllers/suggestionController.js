// src/controllers/suggestionController.js
const pool = require('../config/db');
const sendErrorResponse = require('../utils/errorHandler');
const logger = require('../utils/logger'); // Import logger

// GET /suggestions/public
exports.getPublicSuggestions = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, text, status, EXTRACT(EPOCH FROM submitted_at) * 1000 AS \"submittedAt\" FROM suggestions WHERE status = 'APPROVED' ORDER BY submitted_at DESC"
    );
    logger.debug('Fetched public suggestions', { count: result.rows.length });
    res.status(200).json(result.rows);
  } catch (error) {
    logger.error('Error fetching public suggestions', { message: error.message, stack: error.stack });
    sendErrorResponse(res, 500, 'An internal server error occurred while fetching public suggestions.');
  }
};

// GET /suggestions/admin
exports.getAllSuggestionsAdmin = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, text, status, EXTRACT(EPOCH FROM submitted_at) * 1000 AS \"submittedAt\" FROM suggestions ORDER BY submitted_at DESC"
    );
    logger.debug('Fetched all suggestions for admin', { count: result.rows.length });
    res.status(200).json(result.rows);
  } catch (error) {
    logger.error('Error fetching all suggestions for admin', { message: error.message, stack: error.stack });
    sendErrorResponse(res, 500, 'An internal server error occurred while fetching all suggestions for admin.');
  }
};

// POST /suggestions
exports.submitSuggestion = async (req, res) => {
  const { text } = req.body;

  if (!text || typeof text !== 'string' || text.trim() === '') {
    logger.warn('Attempted to submit empty suggestion', { body: req.body });
    return sendErrorResponse(res, 400, 'Suggestion text cannot be empty.');
  }

  try {
    const result = await pool.query(
      'INSERT INTO suggestions (text) VALUES ($1) RETURNING id, text, status, EXTRACT(EPOCH FROM submitted_at) * 1000 AS "submittedAt"',
      [text.trim()]
    );
    logger.info('New suggestion submitted', { suggestionId: result.rows[0].id, text: result.rows[0].text });
    res.status(201).json(result.rows[0]);
  } catch (error) {
    logger.error('Error submitting new suggestion', { message: error.message, stack: error.stack, suggestionText: text });
    sendErrorResponse(res, 500, 'An internal server error occurred while submitting the suggestion.');
  }
};

// PUT /suggestions/admin/:id/approve
exports.approveSuggestionAdmin = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    logger.warn('Approve suggestion: ID missing', { params: req.params });
    return sendErrorResponse(res, 400, 'Suggestion ID is required.');
  }

  try {
    const checkResult = await pool.query('SELECT status FROM suggestions WHERE id = $1', [id]);

    if (checkResult.rows.length === 0) {
      logger.warn('Approve suggestion: Suggestion not found', { suggestionId: id });
      return sendErrorResponse(res, 404, 'Suggestion not found.');
    }

    const currentStatus = checkResult.rows[0].status;
    if (currentStatus === 'APPROVED') {
      logger.warn('Approve suggestion: Already approved', { suggestionId: id });
      return sendErrorResponse(res, 400, 'Suggestion is already approved.');
    }
    if (currentStatus !== 'PENDING') {
      logger.warn('Approve suggestion: Not pending', { suggestionId: id, currentStatus });
      return sendErrorResponse(res, 400, 'Suggestion is not pending approval.');
    }

    const result = await pool.query(
      "UPDATE suggestions SET status = 'APPROVED' WHERE id = $1 RETURNING id, text, status, EXTRACT(EPOCH FROM submitted_at) * 1000 AS \"submittedAt\"",
      [id]
    );

    if (result.rowCount === 0) {
      logger.error('Approve suggestion: Failed to update, though it was found initially', { suggestionId: id });
      return sendErrorResponse(res, 404, 'Suggestion not found or not updated.');
    }
    logger.info('Suggestion approved', { suggestionId: id });
    res.status(200).json(result.rows[0]);
  } catch (error) {
    if (error.message.includes("invalid input syntax for type uuid")) {
        logger.warn('Approve suggestion: Invalid ID format', { suggestionId: id, error: error.message });
        return sendErrorResponse(res, 400, 'Invalid suggestion ID format.');
    }
    logger.error('Error approving suggestion', { message: error.message, stack: error.stack, suggestionId: id });
    sendErrorResponse(res, 500, 'An internal server error occurred while approving the suggestion.');
  }
};

// DELETE /suggestions/admin/:id
exports.deleteSuggestionAdmin = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    logger.warn('Delete suggestion: ID missing', { params: req.params });
    return sendErrorResponse(res, 400, 'Suggestion ID is required.');
  }

  try {
    const result = await pool.query('DELETE FROM suggestions WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      logger.warn('Delete suggestion: Not found', { suggestionId: id });
      return sendErrorResponse(res, 404, 'Suggestion not found.');
    }
    logger.info('Suggestion deleted', { suggestionId: id });
    res.status(200).json({ message: 'Suggestion deleted successfully.' });
  } catch (error) {
    if (error.message.includes("invalid input syntax for type uuid")) {
        logger.warn('Delete suggestion: Invalid ID format', { suggestionId: id, error: error.message });
        return sendErrorResponse(res, 400, 'Invalid suggestion ID format.');
    }
    logger.error('Error deleting suggestion', { message: error.message, stack: error.stack, suggestionId: id });
    sendErrorResponse(res, 500, 'An internal server error occurred while deleting the suggestion.');
  }
};
