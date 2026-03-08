import { Router } from 'express';
import {
  registerEventController,
  getUserRegistrationsController,
} from '../controllers/registration.controller';
import { authMiddleware, roleGuard } from '../middlewares/auth.middleware';

const registrationRouter = Router({ mergeParams: true });

// Uses eventId param from parent router: /api/events/:eventId/register
registrationRouter.post(
  '/',
  authMiddleware,
  roleGuard(['ATTENDEE', 'ORGANIZER']),
  registerEventController
);

export default registrationRouter;
