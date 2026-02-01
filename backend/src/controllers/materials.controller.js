import { db } from "../config/db.js";

export async function uploadMaterial(req, res) {
  try {
    const { title, type, subjectId } = req.body;
    const filePath = req.file?.path;
    const facultyId = req.user.userId;

    if (!title || !type || !subjectId || !filePath) {
      return res.status(400).json({ message: "Missing fields" });
    }

    await db.query(
      `INSERT INTO materials (title, type, subject_id, file_path, uploaded_by)
       VALUES (?,?,?,?,?)`,
      [title, type, subjectId, filePath, facultyId]
    );

    res.json({ message: "Material uploaded successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function getMaterials(req, res) {
  try {
    const { subjectId } = req.query;

    const [rows] = await db.query(
      `SELECT m.id, m.title, m.type, m.file_path, m.uploaded_at,
              u.name AS uploaded_by
       FROM materials m
       JOIN users u ON m.uploaded_by = u.id
       WHERE m.subject_id = ?`,
      [subjectId]
    );

    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
