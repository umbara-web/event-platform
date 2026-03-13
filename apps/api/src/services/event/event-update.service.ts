import prisma from '../../configs/database';
import { ApiError } from '../../utils/ApiError';
import { MESSAGES } from '../../constants/index';
import cloudinaryService from '../cloudinary.service';
import { validateEventOwnership } from '../event/event-helpers';
import { eventBaseInclude } from '../event/event-types';
import type { UpdateEventInput } from '../../types/event.types';

export async function updateEvent(
  eventId: string,
  organizerId: string,
  data: UpdateEventInput,
  imageFile?: Express.Multer.File
) {
  const event = await validateEventOwnership(eventId, organizerId);

  validateEventCanBeUpdated(event);

  const imageUrl = await getUpdatedImageUrl(event, imageFile, eventId);

  return prisma.event.update({
    where: { id: eventId },
    data: buildUpdateData(data, imageUrl),
    include: eventBaseInclude,
  });
}

function validateEventCanBeUpdated(event: {
  startDate: Date;
  status: string;
}): void {
  const isStarted = event.startDate < new Date();
  const isNotDraft = event.status !== 'DRAFT';

  if (isStarted && isNotDraft) {
    throw ApiError.badRequest(MESSAGES.EVENT.ALREADY_STARTED);
  }
}

async function getUpdatedImageUrl(
  event: { imageUrl: string | null },
  imageFile: Express.Multer.File | undefined,
  eventId: string
): Promise<string | null> {
  if (!imageFile) return event.imageUrl;

  const result = await cloudinaryService.uploadEventImage(
    imageFile.buffer,
    eventId
  );

  return result.url;
}

function buildUpdateData(data: UpdateEventInput, imageUrl: string | null) {
  return {
    ...(data.name && { name: data.name }),
    ...(data.description && { description: data.description }),
    ...(data.categoryId && { categoryId: data.categoryId }),
    ...(data.locationId && { locationId: data.locationId }),
    ...(data.venue && { venue: data.venue }),
    ...(data.address && { address: data.address }),
    ...(data.startDate && { startDate: data.startDate }),
    ...(data.endDate && { endDate: data.endDate }),
    ...(data.status && { status: data.status }),
    ...(imageUrl && { imageUrl }),
  };
}
