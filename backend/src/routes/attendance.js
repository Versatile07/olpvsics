import express from 'express';
import { markAttendance, getStudentAttendance, getClassAttendance } from '../controllers/attendanceController.js';
import { verifyToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';

const router = express.Router();

// Faculty: mark attendance (upsert)
router.post('/mark', verifyToken, requireRole('faculty', 'admin'), markAttendance);

// Get attendance for a student (percentage + records)
router.get('/student/:student_id', verifyToken, getStudentAttendance);

// Get class attendance for a subject on a specific date
router.get('/subject/:subject_id/date/:date', verifyToken, getClassAttendance);

export default router;
