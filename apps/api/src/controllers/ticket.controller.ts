import { Request, Response, NextFunction } from 'express';
import * as ticketService from '../services/ticket.service';

export const createTicketController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { eventId } = req.params;
    const result = await ticketService.createTicketService(
      user.id,
      eventId,
      req.body
    );

    res.status(201).json({
      message: 'Ticket created successfully',
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const getEventTicketsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { eventId } = req.params;
    const result = await ticketService.getTicketsByEventIdService(eventId);

    res.status(200).json({
      message: 'Success',
      data: result,
    });
  } catch (err) {
    next(err);
  }
};
