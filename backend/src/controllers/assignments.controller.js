import { db } from "../config/db.js";

// Faculty: Create assignment
export async function createAssignment(req, res) {
    try {
        const { title, description, subjectId, deadline, maxMarks } = req.body;
        const facultyId = req.user.userId;
        const filePath = req.file?.path || null;

        if (!title || !subjectId || !deadline) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const [result] = await db.query(
            `INSERT INTO assignments (title, description, subject_id, faculty_id, file_path, deadline, max_marks)
       VALUES (?,?,?,?,?,?,?)`,
            [title, description || null, subjectId, facultyId, filePath, deadline, maxMarks || 100]
        );

        res.json({ message: "Assignment created successfully", assignmentId: result.insertId });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// Get assignments (for faculty: their subjects, for students: their semester)
export async function getAssignments(req, res) {
    try {
        const { userId, role } = req.user;
        const { subjectId } = req.query;

        let query, params;

        if (role === "faculty" || role === "admin") {
            query = `
        SELECT a.*, s.name AS subject_name, s.code AS subject_code,
               (SELECT COUNT(*) FROM submissions WHERE assignment_id = a.id) AS submission_count
        FROM assignments a
        JOIN subjects s ON a.subject_id = s.id
        WHERE a.faculty_id = ?
      `;
            params = [userId];
        } else {
            // Student: get assignments for their semester subjects
            query = `
        SELECT a.*, s.name AS subject_name, s.code AS subject_code, u.name AS faculty_name,
               sub.id AS submission_id, sub.submitted_at, sub.marks
        FROM assignments a
        JOIN subjects s ON a.subject_id = s.id
        JOIN users u ON a.faculty_id = u.id
        JOIN users student ON student.id = ?
        LEFT JOIN submissions sub ON sub.assignment_id = a.id AND sub.student_id = ?
        WHERE s.semester = student.semester
      `;
            params = [userId, userId];
        }

        if (subjectId) {
            query += role === "student" ? " AND a.subject_id = ?" : " AND a.subject_id = ?";
            params.push(subjectId);
        }

        query += " ORDER BY a.deadline ASC";

        const [rows] = await db.query(query, params);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// Student: Submit assignment
export async function submitAssignment(req, res) {
    try {
        const { assignmentId } = req.params;
        const studentId = req.user.userId;
        const filePath = req.file?.path;

        if (!filePath) {
            return res.status(400).json({ message: "File is required" });
        }

        // Check if assignment exists and not past deadline
        const [assignment] = await db.query(
            "SELECT deadline FROM assignments WHERE id = ?",
            [assignmentId]
        );

        if (assignment.length === 0) {
            return res.status(404).json({ message: "Assignment not found" });
        }

        // Check for existing submission
        const [existing] = await db.query(
            "SELECT id FROM submissions WHERE assignment_id = ? AND student_id = ?",
            [assignmentId, studentId]
        );

        if (existing.length > 0) {
            // Update existing submission
            await db.query(
                "UPDATE submissions SET file_path = ?, submitted_at = NOW() WHERE id = ?",
                [filePath, existing[0].id]
            );
            res.json({ message: "Submission updated successfully" });
        } else {
            // Create new submission
            await db.query(
                "INSERT INTO submissions (assignment_id, student_id, file_path) VALUES (?,?,?)",
                [assignmentId, studentId, filePath]
            );
            res.json({ message: "Assignment submitted successfully" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// Faculty: Get submissions for an assignment
export async function getSubmissions(req, res) {
    try {
        const { assignmentId } = req.params;

        const [rows] = await db.query(
            `SELECT sub.*, u.name AS student_name, u.roll_number
       FROM submissions sub
       JOIN users u ON sub.student_id = u.id
       WHERE sub.assignment_id = ?
       ORDER BY sub.submitted_at DESC`,
            [assignmentId]
        );

        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// Faculty: Grade submission
export async function gradeSubmission(req, res) {
    try {
        const { submissionId } = req.params;
        const { marks, remarks } = req.body;

        if (marks === undefined) {
            return res.status(400).json({ message: "Marks are required" });
        }

        await db.query(
            "UPDATE submissions SET marks = ?, remarks = ?, graded_at = NOW() WHERE id = ?",
            [marks, remarks || null, submissionId]
        );

        res.json({ message: "Submission graded successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
