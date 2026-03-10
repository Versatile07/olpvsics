import { db } from "./config/db.js";

async function listUsers() {
    try {
        const [rows] = await db.query("SELECT id, name, email, role FROM users");
        console.log("Database Users:");
        console.table(rows);
        process.exit(0);
    } catch (err) {
        console.error("Error listing users:", err.message);
        process.exit(1);
    }
}

listUsers();
