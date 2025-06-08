// src/routes/authRoutes.js
const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

router.post('/login', authController.login);
router.post('/logout', authController.logout); // Assuming client-side token removal

module.exports = router;
