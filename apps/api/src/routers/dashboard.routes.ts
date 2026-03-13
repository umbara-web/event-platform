import { Router } from 'express';
import * as dashboardController from '../controllers/dashboard.controller';
import { validate } from '../middlewares/validate.middleware';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';
import {
  idParamsSchema,
  paginationQuerySchema,
} from '../validators/common.validator';

const router = Router();

// All routes are protected and for organizers only
router.use(authenticate);
router.use(authorize('ORGANIZER'));

router.get('/summary', dashboardController.getSummary);

router.get('/statistics', dashboardController.getStatistics);

router.get('/pending-transactions', dashboardController.getPendingTransactions);

router.get('/recent-activity', dashboardController.getRecentActivity);

router.get(
  '/events/:eventId/participants',
  validate(idParamsSchema),
  dashboardController.getEventParticipants
);

export default router;
