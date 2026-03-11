import request from 'supertest';
import app from '../../src/app';

describe('Auth API', () => {
  it('should register user', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: 'user@test.com',
      password: 'Password123',
      firstName: 'Test',
      lastName: 'User',
    });

    expect(res.status).toBe(201);
    expect(res.body.data.user.email).toBe('user@test.com');
  });
});
