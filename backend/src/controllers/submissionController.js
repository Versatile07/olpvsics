import pool from '../../db/index.js';

/**
 * POST /api/assignments/:id/submit
 * Student only — submit a file for an assignment.
 * TODO: For production, swap multer local storage to Cloudinary/S3.
 */
export async function submitAssignment(req, res) {
  try {
    const { id } = req.params;
    const student_id = req.user.userId;
    const filename = req.file ? req.file.filename : null;

    if (!filename) {
      return res.status(400).json({ message: 'File is required' });
    }

    // Verify assignment exists
    const [assignment] = await pool.query('SELECT id FROM assignments WHERE id = ?', [id]);
    if (assignment.length === 0) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    await pool.query(
      `INSERT INTO submissions (assignment_id, student_id, filename)
       VALUES (?, ?, ?)`,
      [id, student_id, filename]
    );

    res.status(201).json({ message: 'Submission received' });
  } catch (err) {
    console.error('submitAssignment error:', err);
    res.status(500).json({ message: err.message });
  }
}

/**
 * GET /api/assignments/:id/submissions
 * Faculty only — list submissions for an assignment.
 */
export async function getSubmissions(req, res) {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      `SELECT sub.*, u.name AS student_name, u.email AS student_email
       FROM submissions sub
       JOIN users u ON sub.student_id = u.id
       WHERE sub.assignment_id = ?
       ORDER BY sub.submitted_at DESC`,
      [id]
    );

    res.json(rows);
  } catch (err) {
    console.error('getSubmissions error:', err);
    res.status(500).json({ message: err.message });
  }
}
