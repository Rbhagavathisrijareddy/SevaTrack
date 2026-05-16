import express from 'express';
import {
  createReport,
  getReports,
  getMyReports,
  getReportById,
  updateReport,
  updateReportStatus,
  markAsViewed,
  addCustomResponse,
  addAcknowledgment,
  getStats,
  globalSearch,
} from '../controllers/reportController.js';
import { verifyToken, verifyAdmin, verifyWorker } from '../middleware/auth.js';

const router = express.Router();

// Apply token verification to all routes
router.use(verifyToken);

// Admin routes
router.get('/', verifyAdmin, getReports);
router.get('/stats', verifyAdmin, getStats);
router.get('/search/global', verifyAdmin, globalSearch);
router.put('/:id/status', verifyAdmin, updateReportStatus);
router.put('/:id/view', verifyAdmin, markAsViewed);
router.put('/:id/response', verifyAdmin, addCustomResponse);

// Worker routes
router.post('/', verifyWorker, createReport);
router.get('/my-reports', verifyWorker, getMyReports);
router.put('/:id', verifyWorker, updateReport); // Edit own report
router.put('/:id/acknowledge', verifyWorker, addAcknowledgment);

// Shared routes (with authorization check inside)
router.get('/:id', getReportById);

export default router;
