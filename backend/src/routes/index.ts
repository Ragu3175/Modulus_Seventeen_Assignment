import { Router } from 'express';
import authRoutes from './authRoutes';
import taskRoutes from './taskRoutes';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'Modulus Seventeen To-Do REST API',
    version: '1.0.0',
  });
});

// Mount resource routers
router.use('/auth', authRoutes);
router.use('/tasks', taskRoutes);

export default router;
