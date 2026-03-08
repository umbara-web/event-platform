import { Prisma } from '@prisma/client';
import prisma from '../lib/prisma';
import { createCustomError } from '../utils/customError';

export const createTicketService = async (
  organizerId: string,
  eventId: string,
  data: Prisma.TicketUncheckedCreateInput
) => {
  // Verify that the event belongs to this organizer
  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (!event) {
    throw createCustomError(404, 'Event not found');
  }

  if (event.organizerId !== organizerId) {
    throw createCustomError(
      403,
      'You are not authorized to add tickets to this event'
    );
  }

  const ticket = await prisma.ticket.create({
    data: {
      ...data,
      eventId,
    },
  });

  return ticket;
};

export const getTicketsByEventIdService = async (eventId: string) => {
  const tickets = await prisma.ticket.findMany({
    where: { eventId },
  });
  return tickets;
};
