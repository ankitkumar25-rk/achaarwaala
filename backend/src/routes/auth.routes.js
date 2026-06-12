import express from 'express';
import { authRateLimiter } from '../middleware/rateLimit.js';
import { authenticate } from '../middleware/auth.js';
import * as authController from '../controllers/auth.controller.js';

const router = express.Router();

// Verify Firebase ID Token and start session
router.post('/verify-firebase', authRateLimiter, authController.verifyFirebase);

// Standard auth routes
router.post('/login',         authRateLimiter, authController.emailLogin);
router.post('/logout',        authenticate,    authController.logout);
router.post('/refresh',                        authController.refresh);
router.get('/me',             authenticate,    authController.getMe);

export default router;
