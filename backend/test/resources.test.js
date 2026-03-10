/**
 * Resource upload tests.
 */
import { jest } from '@jest/globals';
import path from 'path';
import fs from 'fs';

process.env.JWT_SECRET = 'test-secret-key';
process.env.PORT = '5003';
process.env.UPLOAD_DIR = './test-uploads';

// Ensure test-uploads dir exists
if (!fs.existsSync('./test-uploads')) {
  fs.mkdirSync('./test-uploads', { recursive: true });
}

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

function makeFacultyToken() {
  return jwt.sign({ userId: 2, role: 'faculty' }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

describe('Resources API', () => {
  beforeEach(() => {
    mockQuery.mockReset();
  });

  describe('GET /api/resources', () => {
    it('should return list of resources', async () => {
      const token = makeFacultyToken();
      mockQuery.mockResolvedValueOnce([[
        { id: 1, title: 'Test Note', type: 'note' }
      ]]);

      const res = await request
        .get('/api/resources')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('POST /api/resources', () => {
    it('should create resource with title', async () => {
      const token = makeFacultyToken();
      mockQuery.mockResolvedValueOnce([{ insertId: 1 }]);

      const res = await request
        .post('/api/resources')
        .set('Authorization', `Bearer ${token}`)
        .field('title', 'Test Note')
        .field('subject_id', '1')
        .field('type', 'note');

      expect(res.status).toBe(201);
      expect(res.body.message).toMatch(/created/i);
    });
  });
});
