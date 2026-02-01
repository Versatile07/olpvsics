import express from "express";
import { createNotice, getNotices, deleteNotice } from "../controllers/notices.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

const router = express.Router();

// Admin/Faculty: Create notice
router.post("/", requireAuth(["admin", "faculty"]), upload.single("attachment"), createNotice);

// Get notices (role-filtered)
router.get("/", requireAuth([]), getNotices);

// Admin: Delete notice
router.delete("/:id", requireAuth(["admin"]), deleteNotice);

export default router;
