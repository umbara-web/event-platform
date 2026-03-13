import { Router } from 'express';
import * as reviewController from '../controllers/review.controller';
import { validate } from '../middlewares/validate.middleware';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';
import {
  createReviewSchema,
  updateReviewSchema,
  getReviewsQuerySchema,
} from '../validators/review.validator';
import { idParamsSchema } from '../validators/common.validator';

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
