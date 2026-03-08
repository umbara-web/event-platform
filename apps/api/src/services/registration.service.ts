import { Prisma } from '@prisma/client';
import prisma from '../lib/prisma';
import { createCustomError } from '../utils/customError';

export const registerEventService = async (
  userId: string,
  eventId: string,
  data: {
    ticketId: string;
    attendeeName: string;
    attendeeEmail: string;
    attendeePhone: string;
  }
) => {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (!event) {
    throw createCustomError(404, 'Event not found');
  }

  const ticket = await prisma.ticket.findUnique({
    where: { id: data.ticketId },
    include: {
      _count: {
        select: { registrations: true },
      },
    },
  });

  if (!ticket || ticket.eventId !== eventId) {
    throw createCustomError(404, 'Ticket not found for this event');
  }

  if (ticket._count.registrations >= ticket.capacity) {
    throw createCustomError(400, 'Ticket is sold out');
  }

  // Determine status
  const status = ticket.price === 0 ? 'PAID' : 'PENDING';

  const registration = await prisma.registration.create({
    data: {
      eventId,
      userId,
      ticketId: ticket.id,
      status,
      attendeeName: data.attendeeName,
      attendeeEmail: data.attendeeEmail,
      attendeePhone: data.attendeePhone,
    },
  });

  return registration;
};

export const getRegistrationsByUserService = async (userId: string) => {
  const registrations = await prisma.registration.findMany({
    where: { userId },
    include: {
      event: true,
      ticket: true,
    },
  });
  return registrations;
};
