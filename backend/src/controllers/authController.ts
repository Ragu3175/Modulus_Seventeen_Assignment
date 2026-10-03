import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';
import { AuthenticatedRequest } from '../middleware/auth';

/**
 * Helper to generate JWT token for a user
 */
const generateToken = (id: string): string => {
  const secret = process.env.JWT_SECRET || 'modulus_super_secret_jwt_key_2026_seventeen_dev_secure';
  const expiresIn = process.env.JWT_EXPIRE || '30d';
  return jwt.sign({ id }, secret, { expiresIn: expiresIn as any });
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password, avatar } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: 'An account with this email already exists.',
      });
      return;
    }

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      avatar: avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`,
    });

    const token = generateToken(user._id.toString());

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          createdAt: user.createdAt,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login user with email and password
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user with password field included
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
      return;
    }

    // Check password match
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
      return;
    }

    const token = generateToken(user._id.toString());

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          createdAt: user.createdAt,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current authenticated user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          avatar: req.user.avatar,
          createdAt: req.user.createdAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
export const updateProfile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, avatar, password } = req.body;
    const user = await User.findById(req.userId).select('+password');

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    if (name) user.name = name;
    if (avatar) user.avatar = avatar;
    if (password) user.password = password;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          updatedAt: user.updatedAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
