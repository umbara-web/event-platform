import prisma from '../../configs/database';
import { ApiError } from '../../utils/ApiError';
import { MESSAGES } from '../../constants/index';
import { eventBaseInclude } from '../event/event-types';

export async function publishEvent(eventId: string, organizerId: string) {
  const event = await getEventForPublish(eventId);

  validatePublishPermission(event, organizerId);

  return prisma.event.update({
    where: { id: eventId },
    data: { status: 'PUBLISHED' },
    include: eventBaseInclude,
  });
}

async function getEventForPublish(eventId: string) {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: { ticketTypes: true },
  });

  if (!event) {
    throw ApiError.notFound(MESSAGES.EVENT.NOT_FOUND);
  }

  return event;
}

function validatePublishPermission(
  event: { organizerId: string; status: string; ticketTypes: any[] },
  organizerId: string
): void {
  if (event.organizerId !== organizerId) {
    throw ApiError.forbidden(MESSAGES.AUTH.FORBIDDEN);
  }

  if (event.status !== 'DRAFT') {
    throw ApiError.badRequest(
      'Event hanya dapat dipublikasikan dari status draft'
    );
  }

  if (event.ticketTypes.length === 0) {
    throw ApiError.badRequest('Event harus memiliki minimal 1 jenis tiket');
  }
}
