import pool from '../../db/index.js';

/**
 * POST /api/attendance/mark
 * Faculty only — mark attendance for a class.
 * Body: { subject_id, date, records: [{ student_id, status }] }
 * Uses INSERT ... ON DUPLICATE KEY UPDATE for upsert behavior.
 */
export async function markAttendance(req, res) {
  try {
    const { subject_id, date, records } = req.body;

    if (!subject_id || !date || !Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ message: 'subject_id, date, and records[] are required' });
    }

    // Use upsert: INSERT ... ON DUPLICATE KEY UPDATE
    const values = records.map(r => [subject_id, date, r.student_id, r.status]);

    for (const [sid, d, studentId, status] of values) {
      await pool.query(
        `INSERT INTO attendance (subject_id, date, student_id, status)
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE status = VALUES(status)`,
        [sid, d, studentId, status]
      );
    }

    res.json({ message: 'Attendance marked successfully', count: records.length });
  } catch (err) {
    console.error('markAttendance error:', err);
    res.status(500).json({ message: err.message });
  }
}

/**
 * GET /api/attendance/student/:student_id
 * Returns attendance percentage per subject and raw records.
 */
export async function getStudentAttendance(req, res) {
  try {
    const { student_id } = req.params;

    // Percentage per subject
    const [percentages] = await pool.query(
      `SELECT
         s.id AS subject_id,
         s.name AS subject_name,
         COUNT(a.id) AS total_classes,
         SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) AS present_count,
         ROUND(
           SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) * 100.0 / COUNT(a.id), 1
         ) AS percentage
       FROM attendance a
       JOIN subjects s ON a.subject_id = s.id
       WHERE a.student_id = ?
       GROUP BY s.id
       ORDER BY s.name`,
      [student_id]
    );

    // Raw records
    const [records] = await pool.query(
      `SELECT a.*, s.name AS subject_name
       FROM attendance a
       JOIN subjects s ON a.subject_id = s.id
       WHERE a.student_id = ?
       ORDER BY a.date DESC`,
      [student_id]
    );

    res.json({ percentages, records });
  } catch (err) {
    console.error('getStudentAttendance error:', err);
    res.status(500).json({ message: err.message });
  }
}

/**
 * GET /api/attendance/subject/:subject_id/date/:date
 * Returns class attendance list for a specific date.
 */
export async function getClassAttendance(req, res) {
  try {
    const { subject_id, date } = req.params;

    const [rows] = await pool.query(
      `SELECT a.*, u.name AS student_name
       FROM attendance a
       JOIN users u ON a.student_id = u.id
       WHERE a.subject_id = ? AND a.date = ?
       ORDER BY u.name`,
      [subject_id, date]
    );

    res.json(rows);
  } catch (err) {
    console.error('getClassAttendance error:', err);
    res.status(500).json({ message: err.message });
  }
}
