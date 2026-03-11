import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { uploadSingle } from '../middlewares/upload.middleware.js';
import { updateProfileSchema } from '../validators/user.validator.js';
import {
  idParamsSchema,
  paginationQuerySchema,
} from '../validators/common.validator.js';

const router = Router();

// Public routes
router.get(
  '/organizers/:id',
  validate(idParamsSchema),
  userController.getOrganizerProfile
);

// Protected routes
router.use(authenticate);

router.get('/profile', userController.getProfile);

router.patch(
  '/profile',
  validate(updateProfileSchema),
  userController.updateProfile
);

router.post(
  '/profile/image',
  uploadSingle('image'),
  userController.uploadProfileImage
);

router.get('/points', userController.getPointsBalance);

router.get('/coupons', userController.getCoupons);

router.get(
  '/transactions',
  validate(paginationQuerySchema),
  userController.getTransactionHistory
);

export default router;
