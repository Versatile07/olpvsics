import express from 'express';

import authRoutes from './auth.js';
import resourceRoutes from './resources.js';
import attendanceRoutes from './attendance.js';
import assignmentRoutes from './assignments.js';
import placementRoutes from './placements.js';
import noticeRoutes from './notices.js';
import externalCourseRoutes from './externalCourses.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/resources', resourceRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/assignments', assignmentRoutes);
router.use('/placements', placementRoutes);
router.use('/notices', noticeRoutes);
router.use('/external-courses', externalCourseRoutes);

export default router;
