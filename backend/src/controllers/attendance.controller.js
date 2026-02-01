import { db } from "../config/db.js";

// Faculty: create class + mark attendance
export async function markAttendance(req, res) {
  try {
    const { subjectId, classDate, records } = req.body;
    const facultyId = req.user.userId;

    if (!subjectId || !classDate || !Array.isArray(records)) {
      return res.status(400).json({ message: "Invalid payload" });
    }

    const [cls] = await db.query(
      "INSERT INTO classes (subject_id, class_date, faculty_id) VALUES (?,?,?)",
      [subjectId, classDate, facultyId]
    );

    const classId = cls.insertId;

    const values = records.map(r => [classId, r.studentId, r.status]);
    await db.query(
      "INSERT INTO attendance (class_id, student_id, status) VALUES ?",
      [values]
    );

    res.json({ message: "Attendance marked", classId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Student: view own attendance
export async function viewMyAttendance(req, res) {
  try {
    const studentId = req.user.userId;

    const [rows] = await db.query(
      `SELECT s.name AS subject, c.class_date, a.status
       FROM attendance a
       JOIN classes c ON a.class_id = c.id
       JOIN subjects s ON c.subject_id = s.id
       WHERE a.student_id = ?
       ORDER BY c.class_date DESC`,
      [studentId]
    );

    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
