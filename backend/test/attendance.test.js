/**
 * Attendance tests: mark attendance, duplicate prevention.
 */
import { jest } from '@jest/globals';

process.env.JWT_SECRET = 'test-secret-key';
process.env.PORT = '5004';
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

function makeFacultyToken() {
  return jwt.sign({ userId: 2, role: 'faculty' }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

describe('Attendance API', () => {
  beforeEach(() => {
    mockQuery.mockReset();
  });

  describe('POST /api/attendance/mark', () => {
    it('should mark attendance successfully', async () => {
      const token = makeFacultyToken();
      // Mock upsert queries (one per record)
      mockQuery.mockResolvedValue([{ affectedRows: 1 }]);

      const res = await request
        .post('/api/attendance/mark')
        .set('Authorization', `Bearer ${token}`)
        .send({
          subject_id: 1,
          date: '2026-02-20',
          records: [
            { student_id: 3, status: 'present' },
            { student_id: 4, status: 'absent' },
          ],
        });

      expect(res.status).toBe(200);
      expect(res.body.message).toMatch(/marked/i);
      expect(res.body.count).toBe(2);
    });

    it('should reject invalid payload', async () => {
      const token = makeFacultyToken();

      const res = await request
        .post('/api/attendance/mark')
        .set('Authorization', `Bearer ${token}`)
        .send({ subject_id: 1 }); // missing date and records

      expect(res.status).toBe(400);
    });

    it('should handle duplicate attendance via upsert', async () => {
      const token = makeFacultyToken();
      // Upsert query succeeds (ON DUPLICATE KEY UPDATE)
      mockQuery.mockResolvedValue([{ affectedRows: 2 }]); // 2 = update happened

      const res = await request
        .post('/api/attendance/mark')
        .set('Authorization', `Bearer ${token}`)
        .send({
          subject_id: 1,
          date: '2026-02-20',
          records: [{ student_id: 3, status: 'absent' }],
        });

      expect(res.status).toBe(200);
    });
  });

  describe('GET /api/attendance/student/:student_id', () => {
    it('should return attendance data', async () => {
      const token = makeFacultyToken();
      // Mock percentage query
      mockQuery.mockResolvedValueOnce([[
        { subject_id: 1, subject_name: 'DS', total_classes: 10, present_count: 8, percentage: 80 }
      ]]);
      // Mock records query
      mockQuery.mockResolvedValueOnce([[
        { id: 1, subject_id: 1, date: '2026-02-20', student_id: 3, status: 'present' }
      ]]);

      const res = await request
        .get('/api/attendance/student/3')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.percentages).toBeDefined();
      expect(res.body.records).toBeDefined();
    });
  });
});
