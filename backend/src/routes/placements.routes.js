import express from "express";
import { createPlacement, getPlacements, deletePlacement } from "../controllers/placements.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

// Admin: Create placement
router.post("/", requireAuth(["admin"]), createPlacement);

// Get all placements (authenticated users)
router.get("/", requireAuth([]), getPlacements);

// Admin: Delete placement
router.delete("/:id", requireAuth(["admin"]), deletePlacement);

export default router;
