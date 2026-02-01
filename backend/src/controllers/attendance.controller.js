import { db } from "../config/db.js";

// Faculty: create class + mark attendance
export async function markAttendance(req, res) {
  try {
    const { subjectId, classDate, topic, records } = req.body;
    const facultyId = req.user.userId;

    if (!subjectId || !classDate || !Array.isArray(records)) {
      return res.status(400).json({ message: "Invalid payload" });
    }

    // Check if attendance already exists for this date/subject
    const [existing] = await db.query(
      "SELECT id FROM classes WHERE subject_id = ? AND class_date = ?",
      [subjectId, classDate]
    );

    if (existing.length > 0) {
      return res.status(409).json({ message: "Attendance already marked for this date" });
    }

    const [cls] = await db.query(
      "INSERT INTO classes (subject_id, class_date, faculty_id, topic) VALUES (?,?,?,?)",
      [subjectId, classDate, facultyId, topic || null]
    );

    const classId = cls.insertId;

    const values = records.map(r => [classId, r.studentId, r.status]);
    await db.query(
      "INSERT INTO attendance (class_id, student_id, status) VALUES ?",
      [values]
    );

    res.json({ message: "Attendance marked successfully", classId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Get students for a subject (based on semester)
export async function getStudentsForSubject(req, res) {
  try {
    const { subjectId } = req.params;

    // Get subject semester
    const [subject] = await db.query(
      "SELECT semester FROM subjects WHERE id = ?",
      [subjectId]
    );

    if (subject.length === 0) {
      return res.status(404).json({ message: "Subject not found" });
    }

    // Get students in that semester
    const [students] = await db.query(
      `SELECT id, name, roll_number, email 
       FROM users 
       WHERE role = 'student' AND semester = ?
       ORDER BY roll_number, name`,
      [subject[0].semester]
    );

    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Student: view own attendance with percentage
export async function viewMyAttendance(req, res) {
  try {
    const studentId = req.user.userId;

    // Get attendance records grouped by subject
    const [rows] = await db.query(
      `SELECT 
         s.id AS subject_id,
         s.name AS subject,
         s.code AS subject_code,
         COUNT(a.id) AS total_classes,
         SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) AS present_count,
         ROUND(SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) * 100.0 / COUNT(a.id), 1) AS percentage
       FROM attendance a
       JOIN classes c ON a.class_id = c.id
       JOIN subjects s ON c.subject_id = s.id
       WHERE a.student_id = ?
       GROUP BY s.id
       ORDER BY s.name`,
      [studentId]
    );

    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Student: view detailed attendance for a subject
export async function viewSubjectAttendance(req, res) {
  try {
    const studentId = req.user.userId;
    const { subjectId } = req.params;

    const [rows] = await db.query(
      `SELECT c.class_date, c.topic, a.status
       FROM attendance a
       JOIN classes c ON a.class_id = c.id
       WHERE a.student_id = ? AND c.subject_id = ?
       ORDER BY c.class_date DESC`,
      [studentId, subjectId]
    );

    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Faculty: Get attendance history for a subject
export async function getAttendanceHistory(req, res) {
  try {
    const { subjectId } = req.params;

    const [rows] = await db.query(
      `SELECT 
         c.id AS class_id,
         c.class_date,
         c.topic,
         COUNT(a.id) AS total_students,
         SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) AS present_count
       FROM classes c
       LEFT JOIN attendance a ON c.id = a.class_id
       WHERE c.subject_id = ?
       GROUP BY c.id
       ORDER BY c.class_date DESC`,
      [subjectId]
    );

    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
