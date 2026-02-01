import { db } from "./config/db.js";

async function checkMapping() {
    try {
        // 1. Get Faculty
        const [users] = await db.query("SELECT id, name, email, role FROM users WHERE role = 'faculty'");
        console.log("Faculty Users:", users);

        // 2. Get Subjects for each
        for (const u of users) {
            const [subs] = await db.query("SELECT code, name, faculty_id FROM subjects WHERE faculty_id = ?", [u.id]);
            console.log(`\nUser ${u.name} (ID: ${u.id}) teaches:`);
            if (subs.length === 0) console.log("  -> NO SUBJECTS ASSIGNED!");
            else subs.forEach(s => console.log(`  -> ${s.code}: ${s.name} (FacID: ${s.faculty_id})`));
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkMapping();
