import pool from '../../db/index.js';

/**
 * POST /api/assignments
 * Faculty only — create an assignment.
 */
export async function createAssignment(req, res) {
  try {
    const { title, description, subject_id, deadline } = req.body;
    const faculty_id = req.user.userId;

    if (!title || !subject_id) {
      return res.status(400).json({ message: 'title and subject_id are required' });
    }

    const [result] = await pool.query(
      `INSERT INTO assignments (title, description, subject_id, faculty_id, deadline)
       VALUES (?, ?, ?, ?, ?)`,
      [title, description || null, subject_id, faculty_id, deadline || null]
    );

    res.status(201).json({ message: 'Assignment created', assignmentId: result.insertId });
  } catch (err) {
    console.error('createAssignment error:', err);
    res.status(500).json({ message: err.message });
  }
}

/**
 * GET /api/assignments
 * List assignments. Optional query param: subject_id, faculty_id
 */
export async function getAssignments(req, res) {
  try {
    const { subject_id, faculty_id } = req.query;

    let query = `
      SELECT a.*, s.name AS subject_name, u.name AS faculty_name
      FROM assignments a
      LEFT JOIN subjects s ON a.subject_id = s.id
      LEFT JOIN users u ON a.faculty_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (subject_id) {
      query += ' AND a.subject_id = ?';
      params.push(subject_id);
    }
    if (faculty_id) {
      query += ' AND a.faculty_id = ?';
      params.push(faculty_id);
    }

    query += ' ORDER BY a.deadline ASC';

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error('getAssignments error:', err);
    res.status(500).json({ message: err.message });
  }
}
