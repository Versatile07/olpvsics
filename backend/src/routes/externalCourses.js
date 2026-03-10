import express from 'express';
import {
  createExternalCourse,
  getExternalCourses,
  enrollInCourse,
  uploadCertificate,
} from '../controllers/externalCourseController.js';
import { verifyToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// Faculty/Admin: post external course
router.post('/', verifyToken, requireRole('faculty', 'admin'), createExternalCourse);

// All authenticated: list external courses
router.get('/', verifyToken, getExternalCourses);

// Student: enroll in external course
router.post('/:id/enroll', verifyToken, requireRole('student'), enrollInCourse);

// Student: upload certificate
router.post(
  '/:id/upload-certificate',
  verifyToken,
  requireRole('student'),
  upload.single('file'),
  uploadCertificate
);

export default router;
