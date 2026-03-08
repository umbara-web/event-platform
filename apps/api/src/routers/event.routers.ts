import { Router } from 'express';
import {
  createEventController,
  getEventsController,
  getEventByIdController,
} from '../controllers/event.controller';
import { authMiddleware, roleGuard } from '../middlewares/auth.middleware';

const eventRouter = Router();

eventRouter.get('/', getEventsController);
eventRouter.get('/:id', getEventByIdController);

// Requires Authentication and ORGANIZER Role
eventRouter.post(
  '/',
  authMiddleware,
  roleGuard(['ORGANIZER']),
  createEventController
);

export default eventRouter;
