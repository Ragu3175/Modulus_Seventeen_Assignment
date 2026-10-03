import { Router } from 'express';
import { register, login, getMe, updateProfile } from '../controllers/authController';
import { protect } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { registerSchema, loginSchema, updateProfileSchema } from '../validations/auth.validation';

const router = Router();

// Public routes
router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);

// Protected routes
router.get('/me', protect, getMe);
router.put('/profile', protect, validate(updateProfileSchema), updateProfile);

export default router;
