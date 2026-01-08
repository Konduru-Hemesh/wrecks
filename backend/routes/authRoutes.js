import express from 'express';
import {
  signup,
  login,
  getMe,
  logout,
  deleteAccount,
} from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);

// Protected routes
router.get('/me', authenticate, getMe);
router.post('/logout', authenticate, logout);
router.delete('/delete-account', authenticate, deleteAccount);

export default router;
