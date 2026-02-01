import { db } from "./config/db.js";
import bcrypt from "bcrypt";

async function resetPasswords() {
    try {
        const password = "password123";
        const hash = await bcrypt.hash(password, 10);

        await db.query("UPDATE users SET password_hash = ?", [hash]);
        console.log("All passwords reset to: " + password);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

resetPasswords();
