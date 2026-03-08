import { Prisma } from '@prisma/client';
import prisma from '../lib/prisma';
import { createCustomError } from '../utils/customError';

export const createEventService = async (
  organizerId: string,
  data: Prisma.EventUncheckedCreateInput
) => {
  const event = await prisma.event.create({
    data: {
      ...data,
      organizerId,
    },
  });
  return event;
};

export const getEventsService = async () => {
  const events = await prisma.event.findMany({
    include: {
      tickets: true,
      organizer: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  return events;
};

export const getEventByIdService = async (id: string) => {
  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      tickets: true,
      organizer: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!event) {
    throw createCustomError(404, 'Event not found');
  }

  return event;
};
