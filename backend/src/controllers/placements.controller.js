import { db } from "../config/db.js";

// Admin: Create placement
export async function createPlacement(req, res) {
    try {
        const { title, company, type, description, eligibility, location, salaryPackage, applyLink, deadline } = req.body;
        const postedBy = req.user.userId;

        if (!title || !company || !type || !description || !deadline) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const [result] = await db.query(
            `INSERT INTO placements (title, company, type, description, eligibility, location, salary_package, apply_link, deadline, posted_by)
       VALUES (?,?,?,?,?,?,?,?,?,?)`,
            [title, company, type, description, eligibility || null, location || null, salaryPackage || null, applyLink || null, deadline, postedBy]
        );

        res.json({ message: "Placement posted successfully", placementId: result.insertId });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// Get all placements
export async function getPlacements(req, res) {
    try {
        const { type } = req.query;

        let query = `
      SELECT p.*, u.name AS posted_by_name
      FROM placements p
      JOIN users u ON p.posted_by = u.id
    `;
        const params = [];

        if (type) {
            query += " WHERE p.type = ?";
            params.push(type);
        }

        query += " ORDER BY p.deadline ASC";

        const [rows] = await db.query(query, params);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// Delete placement (admin only)
export async function deletePlacement(req, res) {
    try {
        const { id } = req.params;
        await db.query("DELETE FROM placements WHERE id = ?", [id]);
        res.json({ message: "Placement deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
