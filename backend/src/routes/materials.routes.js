import express from "express";
import {
  uploadMaterial,
  getMaterials
} from "../controllers/materials.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

const router = express.Router();

// Faculty/Admin: upload notes or assignments
router.post(
  "/upload",
  requireAuth(["faculty", "admin"]),
  upload.single("file"),
  uploadMaterial
);

// Student/Faculty/Admin: view materials by subject
router.get(
  "/",
  requireAuth(["student", "faculty", "admin"]),
  getMaterials
);

export default router;
