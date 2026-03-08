import { Router } from 'express';

import authRouter from '../routers/auth.routers';
import eventRouter from '../routers/event.routers';
import ticketRouter from '../routers/ticket.routers';
import registrationRouter from '../routers/registration.routers';
import { getUserRegistrationsController } from '../controllers/registration.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.use('/auth', authRouter);
router.use('/events', eventRouter);

// Dedicated endpoint: GET /api/registrations/me
router.get('/registrations/me', authMiddleware, getUserRegistrationsController);

// Nested routes for tickets and registration handled by event router
eventRouter.use('/:eventId/tickets', ticketRouter);
eventRouter.use('/:eventId/register', registrationRouter);

export default router;
