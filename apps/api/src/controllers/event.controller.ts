import { Request, Response, NextFunction } from 'express';
import * as eventService from '../services/event.service';

export const createEventController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const result = await eventService.createEventService(user.id, req.body);

    res.status(201).json({
      message: 'Event created successfully',
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const getEventsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await eventService.getEventsService();

    res.status(200).json({
      message: 'Success',
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const getEventByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await eventService.getEventByIdService(req.params.id);

    res.status(200).json({
      message: 'Success',
      data: result,
    });
  } catch (err) {
    next(err);
  }
};
