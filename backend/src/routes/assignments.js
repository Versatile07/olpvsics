import express from 'express';
import { createAssignment, getAssignments } from '../controllers/assignmentController.js';
import { submitAssignment, getSubmissions } from '../controllers/submissionController.js';
import { verifyToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// Faculty: create assignment
router.post('/', verifyToken, requireRole('faculty', 'admin'), createAssignment);

// List assignments
router.get('/', verifyToken, getAssignments);

// Student: submit assignment with file
router.post('/:id/submit', verifyToken, requireRole('student'), upload.single('file'), submitAssignment);

// Faculty: list submissions for an assignment
router.get('/:id/submissions', verifyToken, requireRole('faculty', 'admin'), getSubmissions);

export default router;
