import express from 'express';
import {
  checkSymptoms,
  getHealthTips
} from '../controllers/aiController.js';

const router = express.Router();

// POST /api/symptom-check - AI symptom checker
router.post('/symptom-check', checkSymptoms);

// GET /api/health-tips - Get health tips
router.get('/health-tips', getHealthTips);

export default router;
