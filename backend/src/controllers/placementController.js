import pool from '../../db/index.js';

/**
 * POST /api/placements
 * Admin/Faculty — create a placement posting.
 */
export async function createPlacement(req, res) {
  try {
    const { title, company, description, deadline } = req.body;
    const posted_by = req.user.userId;

    if (!title || !company) {
      return res.status(400).json({ message: 'title and company are required' });
    }

    const [result] = await pool.query(
      `INSERT INTO placements (title, company, description, deadline, posted_by)
       VALUES (?, ?, ?, ?, ?)`,
      [title, company, description || null, deadline || null, posted_by]
    );

    res.status(201).json({ message: 'Placement posted', placementId: result.insertId });
  } catch (err) {
    console.error('createPlacement error:', err);
    res.status(500).json({ message: err.message });
  }
}

/**
 * GET /api/placements
 * All users — list placements sorted by deadline.
 */
export async function getPlacements(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT p.*, u.name AS posted_by_name
       FROM placements p
       LEFT JOIN users u ON p.posted_by = u.id
       ORDER BY p.deadline ASC`
    );
    res.json(rows);
  } catch (err) {
    console.error('getPlacements error:', err);
    res.status(500).json({ message: err.message });
  }
}
