import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';

export interface AuthenticatedRequest extends Request {
  user?: IUser;
  userId?: string;
}

interface JwtPayload {
  id: string;
  iat?: number;
  exp?: number;
}

/**
 * Protect routes: verifies Bearer JWT token and attaches user to request
 */
export const protect = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let token: string | undefined;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401).json({
      success: false,
      message: 'Not authorized. Token is missing or invalid.',
    });
    return;
  }

  try {
    const jwtSecret = process.env.JWT_SECRET || 'modulus_super_secret_jwt_key_2026_seventeen_dev_secure';
    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

    // Fetch user from DB
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'The user belonging to this token no longer exists.',
      });
      return;
    }

    req.user = user;
    req.userId = user._id.toString();
    next();
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: 'Not authorized. Invalid or expired token.',
    });
  }
};
