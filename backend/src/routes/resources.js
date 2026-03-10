import express from 'express';
import { createResource, getResources, getResourceById } from '../controllers/resourceController.js';
import { verifyToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// Faculty/Admin: upload a resource (note or paper)
router.post(
  '/',
  verifyToken,
  requireRole('faculty', 'admin'),
  upload.single('file'),
  createResource
);

// Any authenticated user: list resources with optional filters
router.get('/', verifyToken, getResources);

// Any authenticated user: get single resource
router.get('/:id', verifyToken, getResourceById);

export default router;
