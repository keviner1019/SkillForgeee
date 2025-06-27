import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

// Import routes

import authRoutes from './routes/api/auth';
import paymentRoutes from './routes/api/payment'
import pathRoutes from './routes/api/paths';
import nodeRoutes from './routes/api/nodes'
// import nodeRoutes from './routes/api/nodes';
import collaborationRoutes from './routes/api/collaboration';
// import translationRoutes from './routes/api/translation';

// Import middleware
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';
import { rateLimiter } from './middleware/rateLimiter';

// Import services
// import { initializeSocket } from './services/socketService';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"]
  }
});

const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(compression());

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true
}));

// Logging
app.use(morgan('combined'));

// Webhook endpoint needs raw body BEFORE json parsing
app.use('/api/payment/webhook', express.raw({ type: 'application/json' }));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Rate limiting (exclude webhooks from rate limiting)
app.use('/api', (req, res, next) => {
  if (req.path === '/payment/webhook') {
    return next();
  }
  return rateLimiter(req, res, next);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use("/api/payment", paymentRoutes);
app.use('/api/nodes', nodeRoutes);
app.use('/api/paths', pathRoutes);
// app.use('/api/nodes', nodeRoutes);
app.use('/api/collaboration', collaborationRoutes);
// app.use('/api/translation', translationRoutes);

// Initialize Socket.IO for real-time features
// initializeSocket(io);

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 CORS enabled for: ${process.env.CLIENT_URL}`);
}); 