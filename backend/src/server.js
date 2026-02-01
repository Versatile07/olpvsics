import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import path from "path";
import { fileURLToPath } from "url";

import healthRoutes from "./routes/health.routes.js";
import authRoutes from "./routes/auth.routes.js";
import attendanceRoutes from "./routes/attendance.routes.js";
import materialsRoutes from "./routes/materials.routes.js";
import subjectsRoutes from "./routes/subjects.routes.js";
import assignmentsRoutes from "./routes/assignments.routes.js";
import placementsRoutes from "./routes/placements.routes.js";
import noticesRoutes from "./routes/notices.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));
app.use("/api", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/materials", materialsRoutes);
app.use("/api/subjects", subjectsRoutes);
app.use("/api/assignments", assignmentsRoutes);
app.use("/api/placements", placementsRoutes);
app.use("/api/notices", noticesRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
