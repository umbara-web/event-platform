// src/services/event/index.ts

import { createEvent } from './event-create.service';
import { updateEvent } from './event-update.service';
import { deleteEvent } from './event-delete.service';
import {
  getEventByIdOrSlug,
  getEvents,
  getUpcomingEvents,
  getOrganizerEvents,
} from './event-query.service';
import { publishEvent } from './event-publish.service';
import { getCategories, getLocations } from './event-reference.service';

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
