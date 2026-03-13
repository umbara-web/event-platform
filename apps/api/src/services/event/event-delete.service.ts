import prisma from '../../configs/database';
import { ApiError } from '../../utils/ApiError';
import { MESSAGES } from '../../constants/index';
import cloudinaryService from '../cloudinary.service';

export async function deleteEvent(
  eventId: string,
  organizerId: string
): Promise<void> {
  const event = await getEventWithTransactions(eventId);

  validateEventDeletion(event, organizerId);

  await prisma.event.delete({ where: { id: eventId } });

  await cloudinaryService.deleteByPrefix(`events/event-${eventId}`);
}

async function getEventWithTransactions(eventId: string) {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      transactions: {
        where: {
          status: {
            in: ['WAITING_PAYMENT', 'WAITING_CONFIRMATION', 'COMPLETED'],
          },
        },
      },
    },
  });

  if (!event) {
    throw ApiError.notFound(MESSAGES.EVENT.NOT_FOUND);
  }

  return event;
}

function validateEventDeletion(
  event: { organizerId: string; transactions: any[] },
  organizerId: string
): void {
  if (event.organizerId !== organizerId) {
    throw ApiError.forbidden(MESSAGES.AUTH.FORBIDDEN);
  }

  if (event.transactions.length > 0) {
    throw ApiError.badRequest(
      'Tidak dapat menghapus event yang memiliki transaksi aktif'
    );
  }
}
