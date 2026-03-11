import { Router } from 'express';
import * as reviewController from '../controllers/review.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
import {
  createReviewSchema,
  updateReviewSchema,
  getReviewsQuerySchema,
} from '../validators/review.validator.js';
import { idParamsSchema } from '../validators/common.validator.js';

const router = Router();

// Public routes
router.get(
  '/event/:eventId',
  validate(getReviewsQuerySchema),
  reviewController.getEventReviews
);

router.get('/event/:eventId/stats', reviewController.getEventReviewStats);

router.get(
  '/organizer/:organizerId',
  validate(getReviewsQuerySchema),
  reviewController.getOrganizerReviews
);

// Protected routes - Customer only
router.use(authenticate);
router.use(authorize('CUSTOMER'));

router.post('/', validate(createReviewSchema), reviewController.createReview);

router.patch(
  '/:id',
  validate(updateReviewSchema),
  reviewController.updateReview
);

router.delete('/:id', validate(idParamsSchema), reviewController.deleteReview);

export default router;
