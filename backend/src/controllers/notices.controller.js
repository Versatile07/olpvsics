import { db } from "../config/db.js";

// Create notice (admin/faculty)
export async function createNotice(req, res) {
    try {
        const { title, content, priority, targetRole, expiresAt } = req.body;
        const postedBy = req.user.userId;
        const filePath = req.file?.path || null;

        if (!title || !content) {
            return res.status(400).json({ message: "Title and content are required" });
        }

        const [result] = await db.query(
            `INSERT INTO notices (title, content, priority, target_role, attachment_path, expires_at, posted_by)
       VALUES (?,?,?,?,?,?,?)`,
            [title, content, priority || 'normal', targetRole || 'all', filePath, expiresAt || null, postedBy]
        );

        res.json({ message: "Notice posted successfully", noticeId: result.insertId });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// Get notices (role-based filtering)
export async function getNotices(req, res) {
    try {
        const { role } = req.user;

        let query = `
      SELECT n.*, u.name AS posted_by_name
      FROM notices n
      JOIN users u ON n.posted_by = u.id
      WHERE (n.expires_at IS NULL OR n.expires_at >= CURDATE())
        AND (n.target_role = 'all' OR n.target_role = ?)
      ORDER BY 
        CASE n.priority 
          WHEN 'urgent' THEN 1 
          WHEN 'important' THEN 2 
          ELSE 3 
        END,
        n.created_at DESC
    `;

        const [rows] = await db.query(query, [role]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// Delete notice
export async function deleteNotice(req, res) {
    try {
        const { id } = req.params;
        await db.query("DELETE FROM notices WHERE id = ?", [id]);
        res.json({ message: "Notice deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
