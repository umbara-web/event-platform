import { Router } from 'express';
import * as eventController from '../controllers/event.controller';
import { validate } from '../middlewares/validate.middleware';
import {
  authenticate,
  optionalAuthenticate,
} from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';
import { uploadSingle } from '../middlewares/upload.middleware';
import {
  createEventSchema,
  updateEventSchema,
  getEventsQuerySchema,
  getEventParamsSchema,
} from '../validators/event.validator';
import { idParamsSchema } from '../validators/common.validator';

const router = Router();

// Public routes
router.get('/categories', eventController.getCategories);
router.get('/locations', eventController.getLocations);
router.get('/upcoming', eventController.getUpcomingEvents);

router.get('/', validate(getEventsQuerySchema), eventController.getEvents);

router.get(
  '/:idOrSlug',
  validate(getEventParamsSchema),
  eventController.getEvent
);

// Protected routes - Organizer only
router.use(authenticate);
router.use(authorize('ORGANIZER'));

router.post(
  '/',
  uploadSingle('image'),
  validate(createEventSchema),
  eventController.createEvent
);

router.get('/my/events', eventController.getOrganizerEvents);

router.patch(
  '/:id',
  uploadSingle('image'),
  validate(updateEventSchema),
  eventController.updateEvent
);

router.delete('/:id', validate(idParamsSchema), eventController.deleteEvent);

router.post(
  '/:id/publish',
  validate(idParamsSchema),
  eventController.publishEvent
);

export default router;
