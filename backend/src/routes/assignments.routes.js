import express from "express";
import {
    createAssignment,
    getAssignments,
    submitAssignment,
    getSubmissions,
    gradeSubmission
} from "../controllers/assignments.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

const router = express.Router();

// Faculty/Admin: Create assignment
router.post(
    "/",
    requireAuth(["faculty", "admin"]),
    upload.single("file"),
    createAssignment
);

// Get assignments (role-based)
router.get(
    "/",
    requireAuth([]),
    getAssignments
);

// Student: Submit assignment
router.post(
    "/:assignmentId/submit",
    requireAuth(["student"]),
    upload.single("file"),
    submitAssignment
);

// Faculty: Get submissions for an assignment
router.get(
    "/:assignmentId/submissions",
    requireAuth(["faculty", "admin"]),
    getSubmissions
);

// Faculty: Grade a submission
router.patch(
    "/submissions/:submissionId/grade",
    requireAuth(["faculty", "admin"]),
    gradeSubmission
);

export default router;
