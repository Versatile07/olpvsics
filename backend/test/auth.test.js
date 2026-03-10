/**
 * Auth tests: register, login, JWT issuance.
 * These tests mock the DB pool to avoid needing a real MySQL connection.
 */
import { jest } from '@jest/globals';

// Set env before any imports
process.env.JWT_SECRET = 'test-secret-key';
process.env.PORT = '5001';
process.env.UPLOAD_DIR = './test-uploads';

// Mock mysql2/promise to avoid real DB connections
const mockQuery = jest.fn();
const mockPool = { query: mockQuery };

jest.unstable_mockModule('mysql2/promise', () => ({
  default: { createPool: () => mockPool },
  createPool: () => mockPool,
}));

// Must import AFTER mocking
const { default: app } = await import('../src/app.js');
const { default: supertest } = await import('supertest');
const { default: bcrypt } = await import('bcrypt');
const { default: jwt } = await import('jsonwebtoken');

const request = supertest(app);

describe('Auth API', () => {
  beforeEach(() => {
    mockQuery.mockReset();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      // Mock: no existing user found
      mockQuery.mockResolvedValueOnce([[]]); // SELECT
      mockQuery.mockResolvedValueOnce([{ insertId: 1 }]); // INSERT

      const res = await request
        .post('/api/auth/register')
        .send({ name: 'Test', email: 'test@test.com', password: 'Test1234' });

      expect(res.status).toBe(201);
      expect(res.body.message).toMatch(/registered/i);
    });

    it('should reject duplicate email', async () => {
      mockQuery.mockResolvedValueOnce([[{ id: 1 }]]); // existing user found

      const res = await request
        .post('/api/auth/register')
        .send({ name: 'Test', email: 'existing@test.com', password: 'Test1234' });

      expect(res.status).toBe(409);
    });

    it('should reject missing fields', async () => {
      const res = await request
        .post('/api/auth/register')
        .send({ email: 'test@test.com' });

      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should return JWT for valid credentials', async () => {
      const hashedPassword = await bcrypt.hash('Test1234', 10);
      mockQuery.mockResolvedValueOnce([[{
        id: 1, name: 'Test', email: 'test@test.com', password: hashedPassword, role: 'student'
      }]]);

      const res = await request
        .post('/api/auth/login')
        .send({ email: 'test@test.com', password: 'Test1234' });

      expect(res.status).toBe(200);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.role).toBe('student');

      // Verify token is valid
      const payload = jwt.verify(res.body.token, process.env.JWT_SECRET);
      expect(payload.userId).toBe(1);
    });

    it('should reject invalid credentials', async () => {
      mockQuery.mockResolvedValueOnce([[]]); // no user found

      const res = await request
        .post('/api/auth/login')
        .send({ email: 'wrong@test.com', password: 'wrong' });

      expect(res.status).toBe(401);
    });
  });
});
