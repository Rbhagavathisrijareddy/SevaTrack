import express from 'express';
import {
  login,
  workerLogin,
  googleCallback,
  logout,
  getCurrentUser,
  getAllWorkers,
  getWorkerProfile,
  updateWorkerStatus,
} from '../controllers/authController.js';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';

const router = express.Router();


router.post('/login', login); 
router.post('/worker/login', workerLogin);
router.post('/admin/google/callback', googleCallback);
router.post('/logout', verifyToken, logout);

// Protected routes
router.get('/me', verifyToken, getCurrentUser);

// Admin routes
router.get('/admin/workers', verifyToken, verifyAdmin, getAllWorkers);
router.get('/admin/workers/:workerId', verifyToken, verifyAdmin, getWorkerProfile);
router.patch('/admin/workers/:workerId/status', verifyToken, verifyAdmin, updateWorkerStatus);

export default router;
