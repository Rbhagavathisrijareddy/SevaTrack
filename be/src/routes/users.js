import express from 'express';
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '../controllers/userController.js';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/', createUser); // Create new user (signup)

// Protected routes
router.get('/', verifyToken, getAllUsers); // Get all users
router.get('/:userId', verifyToken, getUserById); // Get user by ID
router.patch('/:userId', verifyToken, verifyAdmin, updateUser); // Update user (admin only)
router.delete('/:userId', verifyToken, verifyAdmin, deleteUser); // Delete user (admin only)

export default router;
