// src/routes/suggestionRoutes.js
const express = require('express');
const suggestionController = require('../controllers/suggestionController');
const verifyToken = require('../middleware/authMiddleware'); // Correct path for middleware
const router = express.Router();

// Public routes
router.get('/public', suggestionController.getPublicSuggestions);
router.post('/', suggestionController.submitSuggestion); // POST to /api/suggestions

// Admin routes - protected by verifyToken middleware
router.get('/admin', verifyToken, suggestionController.getAllSuggestionsAdmin);
router.put('/admin/:id/approve', verifyToken, suggestionController.approveSuggestionAdmin);
router.delete('/admin/:id', verifyToken, suggestionController.deleteSuggestionAdmin);

module.exports = router;
