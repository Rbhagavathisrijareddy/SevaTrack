import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './src/config/db.js';
import authRoutes from './src/routes/auth.js';
import userRoutes from './src/routes/users.js';
import reportsRoutes from './src/routes/reports.js';
import ticketsRoutes from './src/routes/tickets.js';
import dashboardRoutes from './src/routes/dashboard.js';
import { errorHandler } from './src/middleware/errorHandler.js';

// Get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));

// Serve static files from frontend build
const frontendBuildPath = path.join(__dirname, '../fe/dist');
app.use(express.static(frontendBuildPath));

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
app.use('/api/reports', reportsRoutes);
app.use('/api/tickets', ticketsRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Welcome route
app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to SevaTrack API',
    version: '1.0.0',
  });
});

// SPA fallback - serve React app for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendBuildPath, 'index.html'));
});

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
