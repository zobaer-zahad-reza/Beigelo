import express from 'express';
import { checkFraudRisk } from '../controllers/fraudController.js';

const router = express.Router();

router.post('/check', checkFraudRisk);

export default router;