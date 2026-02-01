import { db } from "../config/db.js";

export async function uploadMaterial(req, res) {
  try {
    const { title, description, type, subjectId, year } = req.body;
    const filePath = req.file?.path;
    const facultyId = req.user.userId;

    if (!title || !type || !subjectId || !filePath) {
      return res.status(400).json({ message: "Missing fields" });
    }

    // Validate type
    if (!["notes", "paper"].includes(type)) {
      return res.status(400).json({ message: "Invalid type. Must be 'notes' or 'paper'" });
    }

    await db.query(
      `INSERT INTO materials (title, description, type, subject_id, file_path, year, uploaded_by)
       VALUES (?,?,?,?,?,?,?)`,
      [title, description || null, type, subjectId, filePath, year || null, facultyId]
    );

    res.json({ message: "Material uploaded successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function getMaterials(req, res) {
  try {
    const { subjectId, type } = req.query;

    if (!subjectId) {
      return res.status(400).json({ message: "subjectId is required" });
    }

    let query = `
      SELECT m.id, m.title, m.description, m.type, m.file_path, m.year, m.uploaded_at,
             u.name AS uploaded_by
      FROM materials m
      JOIN users u ON m.uploaded_by = u.id
      WHERE m.subject_id = ?
    `;
    const params = [subjectId];

    // Optional type filter
    if (type && ["notes", "paper"].includes(type)) {
      query += " AND m.type = ?";
      params.push(type);
    }

    query += " ORDER BY m.uploaded_at DESC";

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
