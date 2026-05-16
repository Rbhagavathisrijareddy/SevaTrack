import express from 'express';
import {
  getNgoDashboard,
  getWorkerDashboard,
} from '../controllers/dashboardController.js';
import { verifyToken, verifyAdmin, verifyWorker } from '../middleware/auth.js';

const router = express.Router();

// Admin dashboard
router.get('/ngo', verifyToken, verifyAdmin, getNgoDashboard);

// Worker dashboard
router.get('/worker', verifyToken, verifyWorker, getWorkerDashboard);

export default router;
