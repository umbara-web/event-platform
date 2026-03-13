import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { MESSAGES } from '../constants/index';
import eventService from '../services/event/index';
import type { EventFilters } from '../types/event.types';

export const createEvent = asyncHandler(async (req: Request, res: Response) => {
  const event = await eventService.createEvent(req.user!.id, req.body, req.file);

  ApiResponse.created(res, MESSAGES.EVENT.CREATED, event);
});

export const updateEvent = asyncHandler(async (req: Request, res: Response) => {
  if (!req.params.id) {
    throw new Error('Event ID is required');
  }

  const event = await eventService.updateEvent(
    req.params.id as string,
    req.user!.id,
    req.body,
    req.file
  );

  ApiResponse.success(res, MESSAGES.EVENT.UPDATED, event);
});

export const deleteEvent = asyncHandler(async (req: Request, res: Response) => {
  if (!req.params.id) {
    throw new Error('Event ID is required');
  }

  await eventService.deleteEvent(req.params.id as string, req.user!.id);

  ApiResponse.success(res, MESSAGES.EVENT.DELETED);
});

export const getEvent = asyncHandler(async (req: Request, res: Response) => {
  if (!req.params.idOrSlug) {
    throw new Error('Event ID or slug is required');
  }

  const event = await eventService.getEventByIdOrSlug(req.params.idOrSlug as string);

  ApiResponse.success(res, MESSAGES.EVENT.FETCHED, event);
});

export const getEvents = asyncHandler(async (req: Request, res: Response) => {
  const filters: EventFilters = {
    categoryId: req.query.categoryId as string,
    locationId: req.query.locationId as string,
    search: req.query.search as string,
    startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
    endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
    minPrice: req.query.minPrice ? parseInt(req.query.minPrice as string) : undefined,
    maxPrice: req.query.maxPrice ? parseInt(req.query.maxPrice as string) : undefined,
    status: req.query.status as any,
    isFree: req.query.isFree === 'true' ? true : req.query.isFree === 'false' ? false : undefined,
  };

  const pagination = {
    page: parseInt(req.query.page as string) || 1,
    limit: parseInt(req.query.limit as string) || 10,
    sortBy: req.query.sortBy as string,
    sortOrder: req.query.sortOrder as 'asc' | 'desc',
  };

  const result = await eventService.getEvents(filters, pagination);

  ApiResponse.paginated(res, MESSAGES.EVENT.LIST_FETCHED, result.data, result.pagination);
});

export const getUpcomingEvents = asyncHandler(async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 10;
  const events = await eventService.getUpcomingEvents(limit);

  ApiResponse.success(res, MESSAGES.EVENT.LIST_FETCHED, events);
});

export const publishEvent = asyncHandler(async (req: Request, res: Response) => {
  if (!req.params.id) {
    throw new Error('Event ID is required');
  }

  const event = await eventService.publishEvent(req.params.id as string, req.user!.id);

  ApiResponse.success(res, MESSAGES.EVENT.UPDATED, event);
});

export const getCategories = asyncHandler(async (req: Request, res: Response) => {
  const categories = await eventService.getCategories();

  ApiResponse.success(res, 'Kategori berhasil diambil', categories);
});

export const getLocations = asyncHandler(async (req: Request, res: Response) => {
  const locations = await eventService.getLocations();

  ApiResponse.success(res, 'Lokasi berhasil diambil', locations);
});

export const getOrganizerEvents = asyncHandler(async (req: Request, res: Response) => {
  const pagination = {
    page: parseInt(req.query.page as string) || 1,
    limit: parseInt(req.query.limit as string) || 10,
    sortBy: req.query.sortBy as string,
    sortOrder: req.query.sortOrder as 'asc' | 'desc',
  };

  const result = await eventService.getOrganizerEvents(req.user!.id, pagination);

  ApiResponse.paginated(res, MESSAGES.EVENT.LIST_FETCHED, result.data, result.pagination);
});

export default {
  createEvent,
  updateEvent,
  deleteEvent,
  getEvent,
  getEvents,
  getUpcomingEvents,
  publishEvent,
  getCategories,
  getLocations,
  getOrganizerEvents,
};
