import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import apiRoutes from './routes';
import { errorHandler } from './middleware/errorHandler';

// Load environment variables
dotenv.config();

// Initialize Express application
const app: Express = express();
const PORT = process.env.PORT || 5000;

// Security Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  })
);

// Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging Middleware in development
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Rate Limiting (100 requests per 15 minutes per IP)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes',
  },
});
app.use('/api', limiter);

// Mount API Routes
app.use('/api', apiRoutes);

// Root Welcome Endpoint
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: '🚀 Modulus Seventeen To-Do API Server is Running',
    documentation: '/api/health',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        profile: 'GET /api/auth/me',
      },
      tasks: {
        list: 'GET /api/tasks (supports ?status=...&priority=...&category=...&sort=smart&search=...)',
        create: 'POST /api/tasks',
        getOne: 'GET /api/tasks/:id',
        update: 'PATCH /api/tasks/:id',
        toggle: 'PATCH /api/tasks/:id/toggle',
        delete: 'DELETE /api/tasks/:id',
        analytics: 'GET /api/tasks/stats/summary',
      },
    },
  });
});

// 404 Route Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use(errorHandler);

// Start Server & Connect to DB
export const startServer = async () => {
  await connectDB();
  return app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`⚡ Modulus Seventeen To-Do API Server Active!`);
    console.log(`🌐 Local URL: http://localhost:${PORT}`);
    console.log(`🩺 Health check: http://localhost:${PORT}/api/health`);
    console.log(`======================================================\n`);
  });
};

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

export default app;
