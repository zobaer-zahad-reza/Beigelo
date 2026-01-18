import express from 'express';
import { checkFraudRisk } from '../controllers/fraudController.js';

const router = express.Router();

// POST: /api/fraud-check
router.post('/check', checkFraudRisk);

export default router;