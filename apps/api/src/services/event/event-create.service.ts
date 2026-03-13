import { EventStatus } from '@prisma/client';
import prisma from '../../configs/database';
import { generateSlug } from '../../utils/helpers';
import cloudinaryService from '../cloudinary.service';
import { validateCategory, validateLocation } from '../event/event-helpers';
import { eventBaseInclude } from '../event/event-types';
import type { CreateEventInput } from '../../types/event.types';

export async function createEvent(
  organizerId: string,
  data: CreateEventInput,
  imageFile?: Express.Multer.File
) {
  await validateEventData(data);

  const event = await createEventRecord(organizerId, data);

  if (imageFile) {
    return await uploadEventImage(event, imageFile);
  }

  return event;
}

async function validateEventData(data: CreateEventInput): Promise<void> {
  await Promise.all([
    validateCategory(data.categoryId),
    validateLocation(data.locationId),
  ]);
}

async function createEventRecord(organizerId: string, data: CreateEventInput) {
  const slug = generateSlug(data.name);

  return prisma.$transaction(async (tx) => {
    return tx.event.create({
      data: {
        organizerId,
        categoryId: data.categoryId,
        locationId: data.locationId,
        name: data.name,
        slug,
        description: data.description,
        venue: data.venue,
        address: data.address,
        startDate: data.startDate,
        endDate: data.endDate,
        status: EventStatus.DRAFT,
        ticketTypes: {
          create: data.ticketTiers.map(mapTicketTier),
        },
      },
      include: eventBaseInclude,
    });
  });
}

function mapTicketTier(tier: CreateEventInput['ticketTiers'][number]) {
  return {
    name: tier.name,
    description: tier.description,
    price: tier.price,
    ticketType: tier.price === 0 ? ('FREE' as const) : ('PAID' as const),
    quota: tier.quota,
    maxPerUser: tier.maxPerUser ?? 5,
    salesStartDate: tier.salesStartDate,
    salesEndDate: tier.salesEndDate,
  };
}

async function uploadEventImage(event: any, imageFile: Express.Multer.File) {
  const result = await cloudinaryService.uploadEventImage(
    imageFile.buffer,
    event.id
  );

  await prisma.event.update({
    where: { id: event.id },
    data: { imageUrl: result.url },
  });

  return { ...event, imageUrl: result.url };
}
