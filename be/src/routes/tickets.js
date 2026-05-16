import express from 'express';
import {
  createTicket,
  getTickets,
  getMyTickets,
  getTicketById,
  updateTicketStatus,
  addTicketResponse,
  getTicketStats,
} from '../controllers/ticketController.js';
import { verifyToken, verifyAdmin, verifyWorker } from '../middleware/auth.js';

const router = express.Router();

// Apply token verification to all routes
router.use(verifyToken);

// Admin routes
router.get('/', verifyAdmin, getTickets);
router.get('/stats', verifyAdmin, getTicketStats);
router.put('/:id/status', verifyAdmin, updateTicketStatus);
router.put('/:id/response', verifyAdmin, addTicketResponse);

// Worker routes
router.post('/', verifyWorker, createTicket);
router.get('/my-tickets', verifyWorker, getMyTickets);

// Shared routes
router.get('/:id', getTicketById);

export default router;
