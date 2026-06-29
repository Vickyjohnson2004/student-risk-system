import { Router } from 'express';
import { body } from 'express-validator';
import { authMiddleware, adminOnly } from '../middleware/auth';
import { validateRequest } from '../middleware/validate-request';
import {
  getAdminDashboard,
  getAllUsers,
  createUser,
  deleteUser,
  updateUserStatus,
  getSystemReports
} from '../controllers/admin';

const router = Router();

// All admin routes require authentication and admin role
router.use(authMiddleware, adminOnly);

router.get('/dashboard', getAdminDashboard);
router.get('/users', getAllUsers);
router.post('/users', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('role').isIn(['student', 'lecturer', 'admin']).withMessage('Invalid role')
], validateRequest, createUser);
router.delete('/users/:userId', deleteUser);
router.put('/users/:userId/status', [
  body('isActive').isBoolean().withMessage('isActive must be a boolean')
], validateRequest, updateUserStatus);
router.get('/reports', getSystemReports);

export default router;
