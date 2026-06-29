import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import User from '../models/User';

export interface AuthRequest extends Request {
  user?: any;
  role?: string;
}

export async function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];

  if (!token) return res.status(401).json({ status: 'error', message: 'Authentication required' });

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as { userId: string; role: string };
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) return res.status(401).json({ status: 'error', message: 'Invalid session' });
    
    if (!user.isActive) return res.status(401).json({ status: 'error', message: 'Account is inactive' });
    
    req.user = user;
    req.role = user.role;
    next();
  } catch (error) {
    res.status(401).json({ status: 'error', message: 'Invalid token' });
  }
}

export function roleMiddleware(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ status: 'error', message: 'Insufficient permissions' });
    }
    next();
  };
}

// Role-specific middleware
export function studentOnly(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== 'student') {
    return res.status(403).json({ status: 'error', message: 'Student access only' });
  }
  next();
}

export function lecturerOnly(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== 'lecturer') {
    return res.status(403).json({ status: 'error', message: 'Lecturer access only' });
  }
  next();
}

export function adminOnly(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ status: 'error', message: 'Admin access only' });
  }
  next();
}
