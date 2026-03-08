import { Router } from 'express';
import {
  createTicketController,
  getEventTicketsController,
} from '../controllers/ticket.controller';
import { authMiddleware, roleGuard } from '../middlewares/auth.middleware';

// Reusing same route structure for modularity (mounted at /api/events/:eventId/tickets in index)
const ticketRouter = Router({ mergeParams: true });

ticketRouter.get('/', getEventTicketsController);

// Requires Authentication and ORGANIZER Role to add tickets
ticketRouter.post(
  '/',
  authMiddleware,
  roleGuard(['ORGANIZER']),
  createTicketController
);

export default ticketRouter;
