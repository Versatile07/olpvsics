import express from 'express';
import { createPlacement, getPlacements } from '../controllers/placementController.js';
import { verifyToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';

const router = express.Router();

// Admin/Faculty: create placement
router.post('/', verifyToken, requireRole('admin', 'faculty'), createPlacement);

// All authenticated: list placements
router.get('/', verifyToken, getPlacements);

export default router;
