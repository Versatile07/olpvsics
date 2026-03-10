/**
 * Role middleware tests: verify token + role checks.
 */
import { jest } from '@jest/globals';

process.env.JWT_SECRET = 'test-secret-key';
process.env.PORT = '5002';
process.env.UPLOAD_DIR = './test-uploads';

// Mock mysql2/promise
const mockQuery = jest.fn();
const mockPool = { query: mockQuery };

jest.unstable_mockModule('mysql2/promise', () => ({
  default: { createPool: () => mockPool },
  createPool: () => mockPool,
}));

const { default: app } = await import('../src/app.js');
const { default: supertest } = await import('supertest');
const { default: jwt } = await import('jsonwebtoken');

const request = supertest(app);

function makeToken(role) {
  return jwt.sign({ userId: 1, role }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

describe('Role Middleware', () => {
  beforeEach(() => {
    mockQuery.mockReset();
  });

  it('should block requests without token', async () => {
    const res = await request.get('/api/resources');
    expect(res.status).toBe(401);
  });

  it('should block student from faculty-only endpoint', async () => {
    const token = makeToken('student');
    const res = await request
      .post('/api/resources')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Test' });

    expect(res.status).toBe(403);
  });

  it('should allow faculty to access faculty endpoint', async () => {
    const token = makeToken('faculty');
    mockQuery.mockResolvedValueOnce([{ insertId: 1 }]); // INSERT

    const res = await request
      .post('/api/resources')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Test Note' });

    // Should not be 401 or 403
    expect([201, 400, 500]).toContain(res.status);
    expect(res.status).not.toBe(401);
    expect(res.status).not.toBe(403);
  });

  it('should reject expired/invalid token', async () => {
    const res = await request
      .get('/api/resources')
      .set('Authorization', 'Bearer invalid-token');

    expect(res.status).toBe(401);
  });
});
