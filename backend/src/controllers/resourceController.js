import pool from '../../db/index.js';

/**
 * POST /api/resources
 * Faculty only — upload a note or paper.
 * Accepts file (via multer) or url, plus metadata.
 */
export async function createResource(req, res) {
  try {
    const { title, subject_id, year, type, url } = req.body;
    const filename = req.file ? req.file.filename : null;
    const uploaderId = req.user.userId;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    await pool.query(
      `INSERT INTO resources (title, filename, url, uploader_id, subject_id, year, type)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [title, filename, url || null, uploaderId, subject_id || null, year || null, type || 'note']
    );

    res.status(201).json({ message: 'Resource created successfully' });
  } catch (err) {
    console.error('createResource error:', err);
    res.status(500).json({ message: err.message });
  }
}

/**
 * GET /api/resources
 * Supports query params: subject_id, year, type
 */
export async function getResources(req, res) {
  try {
    const { subject_id, year, type } = req.query;

    let query = `
      SELECT r.*, u.name AS uploader_name, s.name AS subject_name
      FROM resources r
      LEFT JOIN users u ON r.uploader_id = u.id
      LEFT JOIN subjects s ON r.subject_id = s.id
      WHERE 1=1
    `;
    const params = [];

    if (subject_id) {
      query += ' AND r.subject_id = ?';
      params.push(subject_id);
    }
    if (year) {
      query += ' AND r.year = ?';
      params.push(year);
    }
    if (type) {
      query += ' AND r.type = ?';
      params.push(type);
    }

    query += ' ORDER BY r.created_at DESC';

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error('getResources error:', err);
    res.status(500).json({ message: err.message });
  }
}

/**
 * GET /api/resources/:id
 * Get single resource details.
 */
export async function getResourceById(req, res) {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      `SELECT r.*, u.name AS uploader_name, s.name AS subject_name
       FROM resources r
       LEFT JOIN users u ON r.uploader_id = u.id
       LEFT JOIN subjects s ON r.subject_id = s.id
       WHERE r.id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('getResourceById error:', err);
    res.status(500).json({ message: err.message });
  }
}
