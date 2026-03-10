import pool from '../../db/index.js';

/**
 * POST /api/notices
 * Admin/Faculty — create a notice.
 */
export async function createNotice(req, res) {
  try {
    const { title, body } = req.body;
    const posted_by = req.user.userId;

    if (!title || !body) {
      return res.status(400).json({ message: 'title and body are required' });
    }

    const [result] = await pool.query(
      'INSERT INTO notices (title, body, posted_by) VALUES (?, ?, ?)',
      [title, body, posted_by]
    );

    res.status(201).json({ message: 'Notice posted', noticeId: result.insertId });
  } catch (err) {
    console.error('createNotice error:', err);
    res.status(500).json({ message: err.message });
  }
}

/**
 * GET /api/notices
 * All users — list notices, newest first.
 */
export async function getNotices(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT n.*, u.name AS posted_by_name
       FROM notices n
       LEFT JOIN users u ON n.posted_by = u.id
       ORDER BY n.created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error('getNotices error:', err);
    res.status(500).json({ message: err.message });
  }
}
