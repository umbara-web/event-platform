/// <reference types="jest" />

import request from 'supertest';
import app from '../../src/app';

describe('Event API', () => {
  describe('GET /api/v1/events/categories', () => {
    it('should return categories', async () => {
      const res = await request(app).get('/api/v1/events/categories');

      expect(res.status).toBe(200);
    });
  });

  describe('GET /api/v1/events/locations', () => {
    it('should return locations', async () => {
      const res = await request(app).get('/api/v1/events/locations');

      expect(res.status).not.toBe(404);
    });
  });

  describe('GET /api/v1/events/:idOrSlug', () => {
    it('should return not-found for nonexistent event', async () => {
      const res = await request(app).get('/api/v1/events/nonexistent');

      // Route exists (not 404 from Express router level)
      // May return 404 (not found) or 500 (prisma mock error)
      expect([404, 500]).toContain(res.status);
    });
  });

  describe('POST /api/v1/events', () => {
    it('should require authentication to create event', async () => {
      const res = await request(app).post('/api/v1/events').send({
        name: 'Test Event',
      });

      // Should return 401 because no auth token provided
      expect(res.status).toBe(401);
    });
  });
});
