import pool from '../../db/index.js';

/**
 * POST /api/external-courses
 * Faculty/Admin — post an external course.
 */
export async function createExternalCourse(req, res) {
  try {
    const { title, provider, link, description, deadline } = req.body;
    const posted_by = req.user.userId;

    if (!title) {
      return res.status(400).json({ message: 'title is required' });
    }

    const [result] = await pool.query(
      `INSERT INTO courses_external (title, provider, link, description, deadline, posted_by)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [title, provider || null, link || null, description || null, deadline || null, posted_by]
    );

    res.status(201).json({ message: 'External course posted', courseId: result.insertId });
  } catch (err) {
    console.error('createExternalCourse error:', err);
    res.status(500).json({ message: err.message });
  }
}

/**
 * GET /api/external-courses
 * All users — list external courses.
 */
export async function getExternalCourses(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT c.*, u.name AS posted_by_name
       FROM courses_external c
       LEFT JOIN users u ON c.posted_by = u.id
       ORDER BY c.created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error('getExternalCourses error:', err);
    res.status(500).json({ message: err.message });
  }
}

/**
 * POST /api/external-courses/:id/enroll
 * Student — enroll in an external course.
 */
export async function enrollInCourse(req, res) {
  try {
    const { id } = req.params;
    const student_id = req.user.userId;

    // Check if already enrolled
    const [existing] = await pool.query(
      'SELECT id FROM enrollments_external WHERE course_id = ? AND student_id = ?',
      [id, student_id]
    );

    if (existing.length > 0) {
      return res.status(409).json({ message: 'Already enrolled in this course' });
    }

    await pool.query(
      `INSERT INTO enrollments_external (course_id, student_id, status) VALUES (?, ?, 'registered')`,
      [id, student_id]
    );

    res.status(201).json({ message: 'Enrolled successfully' });
  } catch (err) {
    console.error('enrollInCourse error:', err);
    res.status(500).json({ message: err.message });
  }
}

/**
 * POST /api/external-courses/:id/upload-certificate
 * Student — upload certificate and mark completed.
 * TODO: For production, swap multer local storage to Cloudinary/S3.
 */
export async function uploadCertificate(req, res) {
  try {
    const { id } = req.params;
    const student_id = req.user.userId;
    const filename = req.file ? req.file.filename : null;

    if (!filename) {
      return res.status(400).json({ message: 'Certificate file is required' });
    }

    // Update enrollment with certificate
    const certificate_url = `/uploads/${filename}`;
    const [result] = await pool.query(
      `UPDATE enrollments_external
       SET certificate_url = ?, status = 'completed'
       WHERE course_id = ? AND student_id = ?`,
      [certificate_url, id, student_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Enrollment not found. Enroll first.' });
    }

    res.json({ message: 'Certificate uploaded, course marked as completed' });
  } catch (err) {
    console.error('uploadCertificate error:', err);
    res.status(500).json({ message: err.message });
  }
}
