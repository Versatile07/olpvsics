import express from "express";
import { getSubjects, getMySubjects } from "../controllers/subjects.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

// Get all subjects (optionally filter by semester)
router.get("/", requireAuth([]), getSubjects);

// Get subjects for current user (based on role)
router.get("/my", requireAuth([]), getMySubjects);

export default router;
