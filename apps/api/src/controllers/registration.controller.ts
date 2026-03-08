import { Request, Response, NextFunction } from 'express';
import * as registrationService from '../services/registration.service';

export const registerEventController = async (
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
    const { ticketId, attendeeName, attendeeEmail, attendeePhone } = req.body;

    // Use logged in user's details if not provided
    const payload = {
      ticketId,
      attendeeName: attendeeName || user.name,
      attendeeEmail: attendeeEmail || user.email,
      attendeePhone: attendeePhone || '0000',
    };

    const result = await registrationService.registerEventService(
      user.id,
      eventId,
      payload
    );

    res.status(201).json({
      message: 'Registration successful',
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const getUserRegistrationsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const result = await registrationService.getRegistrationsByUserService(
      user.id
    );

    res.status(200).json({
      message: 'Success',
      data: result,
    });
  } catch (err) {
    next(err);
  }
};
