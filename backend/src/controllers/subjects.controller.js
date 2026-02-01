import { db } from "../config/db.js";

// Get all subjects (optionally filtered by semester)
export async function getSubjects(req, res) {
    try {
        const { semester } = req.query;

        let query = `
      SELECT s.id, s.name, s.code, s.semester, 
             u.name AS faculty_name
      FROM subjects s
      LEFT JOIN users u ON s.faculty_id = u.id
    `;
        const params = [];

        if (semester) {
            query += " WHERE s.semester = ?";
            params.push(semester);
        }

        query += " ORDER BY s.semester, s.name";

        const [rows] = await db.query(query, params);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// Get subjects for current user
export async function getMySubjects(req, res) {
    try {
        const { userId, role } = req.user;
        let query, params;

        if (role === "faculty") {
            // Faculty: get subjects they teach
            query = `
        SELECT s.id, s.name, s.code, s.semester
        FROM subjects s
        WHERE s.faculty_id = ?
        ORDER BY s.semester, s.name
      `;
            params = [userId];
        } else if (role === "student") {
            // Student: get subjects of their semester
            query = `
        SELECT s.id, s.name, s.code, s.semester, u.name AS faculty_name
        FROM subjects s
        LEFT JOIN users u ON s.faculty_id = u.id
        JOIN users student ON student.id = ?
        WHERE s.semester = student.semester
        ORDER BY s.name
      `;
            params = [userId];
        } else {
            // Admin: get all subjects
            query = `
        SELECT s.id, s.name, s.code, s.semester, u.name AS faculty_name
        FROM subjects s
        LEFT JOIN users u ON s.faculty_id = u.id
        ORDER BY s.semester, s.name
      `;
            params = [];
        }

        const [rows] = await db.query(query, params);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
