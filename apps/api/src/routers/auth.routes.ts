import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { validate } from '../middlewares/validate.middleware';
import { authenticate } from '../middlewares/auth.middleware';
import {
  authLimiter,
  passwordResetLimiter,
} from '../middlewares/rateLimiter.middleware';
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
} from '../validators/auth.validator';

const router = Router();

// Public routes
router.post(
  '/register',
  authLimiter,
  validate(registerSchema),
  authController.register
);

router.post('/login', authLimiter, validate(loginSchema), authController.login);

router.post(
  '/refresh-token',
  validate(refreshTokenSchema),
  authController.refreshToken
);

router.post(
  '/forgot-password',
  passwordResetLimiter,
  validate(forgotPasswordSchema),
  authController.forgotPassword
);

router.post(
  '/reset-password',
  passwordResetLimiter,
  validate(resetPasswordSchema),
  authController.resetPassword
);

// Protected routes
router.use(authenticate);

router.get('/me', authController.getMe);

router.post('/logout', authController.logout);

router.post('/logout-all', authController.logoutAll);

router.post(
  '/change-password',
  validate(changePasswordSchema),
  authController.changePassword
);

export default router;
