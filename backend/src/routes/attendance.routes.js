import express from "express";
import { markAttendance, viewMyAttendance } from "../controllers/attendance.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

// Faculty/Admin only
router.post(
  "/mark",
  requireAuth(["faculty", "admin"]),
  markAttendance
);

// Student only
router.get(
  "/me",
  requireAuth(["student"]),
  viewMyAttendance
);

export default router;
