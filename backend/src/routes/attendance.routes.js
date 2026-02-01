import express from "express";
import {
  markAttendance,
  viewMyAttendance,
  viewSubjectAttendance,
  getStudentsForSubject,
  getAttendanceHistory
} from "../controllers/attendance.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

// Faculty/Admin: Mark attendance
router.post(
  "/mark",
  requireAuth(["faculty", "admin"]),
  markAttendance
);

// Faculty/Admin: Get students for a subject (for marking)
router.get(
  "/students/:subjectId",
  requireAuth(["faculty", "admin"]),
  getStudentsForSubject
);

// Faculty/Admin: Get attendance history for a subject
router.get(
  "/history/:subjectId",
  requireAuth(["faculty", "admin"]),
  getAttendanceHistory
);

// Student: View own attendance summary (with percentages)
router.get(
  "/me",
  requireAuth(["student"]),
  viewMyAttendance
);

// Student: View detailed attendance for a subject
router.get(
  "/me/:subjectId",
  requireAuth(["student"]),
  viewSubjectAttendance
);

export default router;
