/**
 * Chat Routes
 * POST /api/chat — Follow-up questions on previous analysis
 */

const express = require('express');
const router = express.Router();
const { handleChat } = require('../controllers/chatController');
const validateRequest = require('../middleware/validateRequest');
const { chatRequestSchema } = require('../schemas/analysisSchema');

router.post('/', validateRequest(chatRequestSchema), handleChat);

module.exports = router;
