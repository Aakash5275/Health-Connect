import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';

import logger from './config/logger.js';
import { createCorsMiddleware } from './middleware/cors.js';
import { apiRateLimiter } from './middleware/rateLimit.js';
import { authenticate } from './middleware/auth.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

// Import routes
import usersRouter from './routes/users.js';
import appointmentsRouter from './routes/appointments.js';
import recordsRouter from './routes/records.js';
import medicinesRouter from './routes/medicines.js';
import aiRouter from './routes/ai.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & core middleware
app.use(helmet());
app.use(createCorsMiddleware());
app.use(express.json());
app.use(compression());

// HTTP request logging
app.use(
  morgan('combined', {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  }),
);

// Rate limiting and authentication for API routes
app.use('/api', apiRateLimiter);
app.use('/api', authenticate);

// API Routes
app.use('/api/users', usersRouter);
app.use('/api/appointments', appointmentsRouter);
app.use('/api/records', recordsRouter);
app.use('/api/medicines', medicinesRouter);
app.use('/api', aiRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Rural TeleHealth API is running',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Rural TeleHealth Access System API',
    version: '1.0.0',
    endpoints: {
      users: '/api/users',
      appointments: '/api/appointments',
      records: '/api/records',
      medicines: '/api/medicines',
      symptomCheck: '/api/symptom-check',
      healthTips: '/api/health-tips',
      health: '/api/health'
    }
  });
});

// 404 and error handlers
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  logger.info(
    `Rural TeleHealth API server running on http://localhost:${PORT} in ${
      process.env.NODE_ENV || 'development'
    } mode`,
  );
});

export default app;
