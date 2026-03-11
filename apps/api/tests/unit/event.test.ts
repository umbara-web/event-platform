/// <reference types="jest" />

import { prismaMock } from '../prismaMock';
import { eventService } from '../../src/services';
import { ApiError } from '../../src/utils/ApiError';
import {
  createMockOrganizer,
  createMockEvent,
  createMockTicketTier,
  createMockCategory,
  createMockLocation,
} from '../helpers/testUtils';
import { faker } from '@faker-js/faker';

// ✅ Mock helpers yang menggunakan uuid
jest.mock('../../src/utils/helpers', () => ({
  generateSlug: jest.fn((name: string) => `${name.toLowerCase().replace(/\s+/g, '-')}-xxxxxxxx`),
  generateInvoiceNumber: jest.fn(() => 'INV-20240101-XXXXXXXX'),
}));

describe('EventService', () => {
  describe('createEvent', () => {
    const organizerId = 'organizer-123';
    const eventData = {
      name: 'New Event',
      description: 'Event description',
      categoryId: 'category-123',
      locationId: 'location-123',
      venue: 'Test Venue',
      address: 'Test Address',
      startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 31 * 24 * 60 * 60 * 1000),
      ticketTiers: [
        {
          name: 'Regular',
          price: 100000,
          ticketType: 'PAID' as const,
          quota: 100,
          salesStartDate: new Date(),
          salesEndDate: new Date(Date.now() + 29 * 24 * 60 * 60 * 1000),
        },
      ],
    };

    it('should create event successfully', async () => {
      prismaMock.category.findUnique.mockResolvedValue(createMockCategory());
      prismaMock.location.findUnique.mockResolvedValue(createMockLocation());

      const mockEvent = {
        ...createMockEvent(organizerId, { name: eventData.name }),
        category: createMockCategory(),
        location: createMockLocation(),
        organizer: createMockOrganizer(),
        ticketTiers: [createMockTicketTier('event-123')],
      };

      (prismaMock.$transaction as jest.Mock).mockImplementation(async (callback: any) => {
        prismaMock.event.create.mockResolvedValue(mockEvent as any);
        return callback(prismaMock);
      });

      const result = await eventService.createEvent(organizerId, eventData);

      expect(result).toBeDefined();
      expect(result.name).toBeDefined();
    });

    it('should throw error if category not found', async () => {
      prismaMock.category.findUnique.mockResolvedValue(null);
      prismaMock.location.findUnique.mockResolvedValue(createMockLocation());

      await expect(eventService.createEvent(organizerId, eventData)).rejects.toThrow(ApiError);
    });

    it('should throw error if location not found', async () => {
      prismaMock.category.findUnique.mockResolvedValue(createMockCategory());
      prismaMock.location.findUnique.mockResolvedValue(null);

      await expect(eventService.createEvent(organizerId, eventData)).rejects.toThrow(ApiError);
    });
  });

  describe('getEventByIdOrSlug', () => {
    it('should return event by ID', async () => {
      const mockTicketTier = createMockTicketTier('event-123');
      const mockEvent = {
        ...createMockEvent('organizer-123'),
        category: createMockCategory(),
        location: createMockLocation(),
        organizer: {
          id: 'organizer-123',
          firstName: 'Test',
          lastName: 'Organizer',
          profileImage: null,
        },
        ticketTypes: [
          {
            ...mockTicketTier,
            soldCount: 10,
          },
        ],
        vouchers: [],
        _count: { reviews: 5, transactions: 10 },
      };

      prismaMock.event.findFirst.mockResolvedValue(mockEvent as any);
      prismaMock.review.aggregate.mockResolvedValue({
        _avg: { rating: 4.5 },
        _count: {},
        _max: {},
        _min: {},
        _sum: {},
      });

      const result = await eventService.getEventByIdOrSlug('event-123');

      expect(result).toBeDefined();
      expect(result.averageRating).toBe(4.5);
    });

    it('should throw error if event not found', async () => {
      prismaMock.event.findFirst.mockResolvedValue(null);

      await expect(eventService.getEventByIdOrSlug('nonexistent')).rejects.toThrow(ApiError);
    });
  });

  describe('deleteEvent', () => {
    it('should delete event if no active transactions', async () => {
      const mockEvent = {
        ...createMockEvent('organizer-123'),
        transactions: [],
      };

      prismaMock.event.findUnique.mockResolvedValue(mockEvent as any);
      prismaMock.event.delete.mockResolvedValue(mockEvent as any);

      await eventService.deleteEvent('event-123', 'organizer-123');

      expect(prismaMock.event.delete).toHaveBeenCalledWith({
        where: { id: 'event-123' },
      });
    });

    it('should throw error if event has active transactions', async () => {
      const mockEvent = {
        ...createMockEvent('organizer-123'),
        transactions: [{ id: 'transaction-123', status: 'COMPLETED' }],
      };

      prismaMock.event.findUnique.mockResolvedValue(mockEvent as any);

      await expect(eventService.deleteEvent('event-123', 'organizer-123')).rejects.toThrow(
        ApiError
      );
    });

    it('should throw error if not the owner', async () => {
      const mockEvent = createMockEvent('other-organizer');

      prismaMock.event.findUnique.mockResolvedValue(mockEvent as any);

      await expect(eventService.deleteEvent('event-123', 'organizer-123')).rejects.toThrow(
        ApiError
      );
    });
  });
});

export function createMockEventFull() {
  const organizer = createMockOrganizer();
  const category = createMockCategory();
  const location = createMockLocation();

  const event = createMockEvent(organizer.id);

  const ticketTier = createMockTicketTier(event.id);

  return {
    organizer,
    category,
    location,
    event,
    ticketTier,
  };
}

export function generateFakeEvent() {
  return {
    name: faker.company.name(),
    description: faker.lorem.paragraph(),
    venue: faker.location.street(),
    address: faker.location.streetAddress(),
    startDate: faker.date.future(),
    endDate: faker.date.future(),
  };
}
