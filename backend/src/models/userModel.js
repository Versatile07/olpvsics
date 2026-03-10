import pool from '../../db/index.js';

/**
 * User model helper functions using connection pool.
 */
export async function findByEmail(email) {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0] || null;
}

export async function findById(id) {
  const [rows] = await pool.query('SELECT id, name, email, role, department_id, created_at FROM users WHERE id = ?', [id]);
  return rows[0] || null;
}

export async function createUser({ name, email, password, role = 'student', department_id = null }) {
  const [result] = await pool.query(
    'INSERT INTO users (name, email, password, role, department_id) VALUES (?, ?, ?, ?, ?)',
    [name, email, password, role, department_id]
  );
  return result.insertId;
}
