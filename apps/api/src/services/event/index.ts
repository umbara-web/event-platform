// src/services/event/index.ts

import { createEvent } from './event-create.service.js';
import { updateEvent } from './event-update.service.js';
import { deleteEvent } from './event-delete.service.js';
import {
  getEventByIdOrSlug,
  getEvents,
  getUpcomingEvents,
  getOrganizerEvents,
} from './event-query.service.js';
import { publishEvent } from './event-publish.service.js';
import { getCategories, getLocations } from './event-reference.service.js';

class EventService {
  createEvent = createEvent;
  updateEvent = updateEvent;
  deleteEvent = deleteEvent;
  getEventByIdOrSlug = getEventByIdOrSlug;
  getEvents = getEvents;
  getUpcomingEvents = getUpcomingEvents;
  getOrganizerEvents = getOrganizerEvents;
  publishEvent = publishEvent;
  getCategories = getCategories;
  getLocations = getLocations;
}

export const eventService = new EventService();
export default eventService;
