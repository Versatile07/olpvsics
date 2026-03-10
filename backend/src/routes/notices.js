import express from 'express';
import { createNotice, getNotices } from '../controllers/noticeController.js';
import { verifyToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';

const router = express.Router();

// Admin/Faculty: create notice
router.post('/', verifyToken, requireRole('admin', 'faculty'), createNotice);

// All authenticated: list notices
router.get('/', verifyToken, getNotices);

export default router;
