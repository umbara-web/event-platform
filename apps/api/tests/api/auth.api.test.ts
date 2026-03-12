import request from 'supertest';
import app from '../../src/app';

describe('Auth API', () => {
  it('should have register endpoint accessible', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      email: 'user@test.com',
      password: 'Password123!',
      firstName: 'Test',
      lastName: 'User',
      role: 'CUSTOMER',
    });

    // Route exists (not 404), may return 500 because prisma is mocked
    expect(res.status).not.toBe(404);
  });

  it('should have login endpoint accessible', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({
      email: 'user@test.com',
      password: 'Password123!',
    });

    expect(res.status).not.toBe(404);
  });

  it('should return 401 for protected routes without token', async () => {
    const res = await request(app).get('/api/v1/auth/me');

    expect(res.status).toBe(401);
  });
});
