import express from "express";
import { db } from "../config/db.js";

const router = express.Router();

router.get("/health", async (req, res) => {
  try {
    await db.query("SELECT 1");
    res.status(200).json({ status: "ok", db: "connected" });
  } catch (error) {
    res.status(500).json({ status: "error", db: "not connected" });
  }
});

export default router;
