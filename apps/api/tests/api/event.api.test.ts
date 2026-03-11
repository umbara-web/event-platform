/// <reference types="jest" />

import request from 'supertest';
import app from '../../src/app';

import { prisma } from '../../src/lib/prisma';
import { resetTestDatabase } from '../db/resetTestDb';
import { seedBasicData } from '../seed/testSeeder';

describe('Event API', () => {
  beforeEach(async () => {
    await resetTestDatabase();
  });

  describe('POST /api/events', () => {
    it('should create a new event', async () => {
      const { category, location } = await seedBasicData();

      const res = await request(app)
        .post('/api/events')
        .send({
          name: 'Music Festival',
          description: 'Big music event',
          categoryId: category.id,
          locationId: location.id,
          venue: 'Jakarta Convention Center',
          address: 'Jakarta',
          startDate: new Date(Date.now() + 86400000),
          endDate: new Date(Date.now() + 172800000),

          ticketTiers: [
            {
              name: 'Regular',
              price: 100000,
              quota: 100,
              ticketType: 'PAID',
              salesStartDate: new Date(),
              salesEndDate: new Date(Date.now() + 86400000),
            },
          ],
        });

      expect(res.status).toBe(201);
      expect(res.body.data.name).toBe('Music Festival');
    });

    it('should fail if category not found', async () => {
      const { location } = await seedBasicData();

      const res = await request(app)
        .post('/api/events')
        .send({
          name: 'Music Festival',
          description: 'Big music event',
          categoryId: 'invalid-category',
          locationId: location.id,
          venue: 'Jakarta Convention Center',
          address: 'Jakarta',
          startDate: new Date(Date.now() + 86400000),
          endDate: new Date(Date.now() + 172800000),
          ticketTiers: [],
        });

      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/events/:id', () => {
    it('should return event detail', async () => {
      const { category, location } = await seedBasicData();

      const event = await prisma.event.create({
        data: {
          organizerId: 'organizer-123',
          categoryId: category.id,
          locationId: location.id,
          name: 'Test Event',
          slug: 'test-event',
          description: 'Test description',
          venue: 'Test Venue',
          address: 'Test Address',
          startDate: new Date(Date.now() + 86400000),
          endDate: new Date(Date.now() + 172800000),
          status: 'PUBLISHED',
        },
      });

      const res = await request(app).get(`/api/events/${event.id}`);

      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(event.id);
    });

    it('should return 404 if event not found', async () => {
      const res = await request(app).get('/api/events/nonexistent');

      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /api/events/:id', () => {
    it('should delete event', async () => {
      const { category, location } = await seedBasicData();

      const event = await prisma.event.create({
        data: {
          organizerId: 'organizer-123',
          categoryId: category.id,
          locationId: location.id,
          name: 'Delete Event',
          slug: 'delete-event',
          description: 'Test description',
          venue: 'Test Venue',
          address: 'Test Address',
          startDate: new Date(Date.now() + 86400000),
          endDate: new Date(Date.now() + 172800000),
          status: 'PUBLISHED',
        },
      });

      const res = await request(app).delete(`/api/events/${event.id}`);

      expect(res.status).toBe(200);
    });
  });
});
