import { Event, EventStatus } from '@prisma/client';

export class EventBuilder {
  private data: Event;

  constructor() {
    this.data = {
      id: 'event-' + Math.random(),
      organizerId: 'organizer-123',
      categoryId: 'category-123',
      locationId: 'location-123',
      name: 'Test Event',
      slug: 'test-event',
      description: 'Test event',
      venue: 'Test Venue',
      address: 'Test Address',
      imageUrl: null,
      startDate: new Date(Date.now() + 86400000),
      endDate: new Date(Date.now() + 172800000),
      status: EventStatus.PUBLISHED,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  draft() {
    this.data.status = EventStatus.DRAFT;
    return this;
  }

  cancelled() {
    this.data.status = EventStatus.CANCELLED;
    return this;
  }

  withName(name: string) {
    this.data.name = name;
    return this;
  }

  build(): Event {
    return this.data;
  }
}
