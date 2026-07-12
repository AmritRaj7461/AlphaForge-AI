/**
 * Analyze Routes
 * POST /api/analyze — Full company analysis via ARGUS
 */

const express = require('express');
const router = express.Router();
const { analyzeCompany } = require('../controllers/analysisController');
const validateRequest = require('../middleware/validateRequest');
const { analyzeRequestSchema } = require('../schemas/analysisSchema');

router.post('/', validateRequest(analyzeRequestSchema), analyzeCompany);

module.exports = router;
