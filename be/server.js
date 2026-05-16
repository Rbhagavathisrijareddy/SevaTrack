import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './src/config/db.js';
import authRoutes from './src/routes/auth.js';
import userRoutes from './src/routes/users.js';
import { errorHandler } from './src/middleware/errorHandler.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));

// Connect to MongoDB
connectDB();

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'Server is running',
    timestamp: new Date(),
    environment: process.env.NODE_ENV,
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Welcome route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to SevaTrack API',
    version: '1.0.0',
    endpoints: {
      worker_login: 'POST /api/auth/worker/login',
      admin_google_callback: 'POST /api/auth/admin/google/callback',
      logout: 'POST /api/auth/logout',
      current_user: 'GET /api/auth/me',
      get_workers: 'GET /api/auth/admin/workers (admin only)',
      create_user: 'POST /api/users (signup)',
      get_all_users: 'GET /api/users (protected)',
      get_user: 'GET /api/users/:userId (protected)',
      update_user: 'PATCH /api/users/:userId (admin only)',
      delete_user: 'DELETE /api/users/:userId (admin only)',
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════════════════════╗
  ║       SevaTrack Backend Server Running                   ║
  ║       Environment: ${process.env.NODE_ENV || 'development'}                            ║
  ║       Server: http://localhost:${PORT}                         ║
  ║       API Documentation: http://localhost:${PORT}          ║
  ╚══════════════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});
