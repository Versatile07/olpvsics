import { db } from "./config/db.js";
import bcrypt from "bcrypt";

async function updateFacultyPassword() {
    try {
        const password = "lavi4h.07";
        const hash = await bcrypt.hash(password, 10);
        const email = "sharma@vsics.edu";

        await db.query("UPDATE users SET password_hash = ? WHERE email = ?", [hash, email]);
        console.log(`Password for ${email} updated successfully.`);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

updateFacultyPassword();
