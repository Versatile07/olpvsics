import { db } from "./config/db.js";
import bcrypt from "bcrypt";

const students = [
    { name: "Parth", email: "parth@vsics.edu", passwordBase: "Parth@123", semester: 1 },
    { name: "Arushi", email: "arushi@vsics.edu", passwordBase: "Arushi@123", semester: 2 },
    { name: "Sarthak", email: "sarthak@vsics.edu", passwordBase: "Sarthak@123", semester: 3 },
    { name: "Rishita", email: "rishita@vsics.edu", passwordBase: "Rishita@123", semester: 4 },
    { name: "Shaswat", email: "shaswat@vsics.edu", passwordBase: "Shaswat@123", semester: 5 }
];

async function seedStudents() {
    try {
        console.log("Seeding Students...");

        for (const s of students) {
            const hash = await bcrypt.hash(s.passwordBase, 10);
            try {
                await db.query(
                    `INSERT INTO users (name, email, password_hash, role, semester, department)
           VALUES (?, ?, ?, 'student', ?, 'Computer Applications')`,
                    [s.name, s.email, hash, s.semester]
                );
                console.log(`Created Student: ${s.name} (${s.email})`);
            } catch (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    console.log(`Skipped (Duplicate): ${s.name}`);
                } else {
                    console.error(`Error adding ${s.name}:`, err.message);
                }
            }
        }

        console.log("\nStudent seeding complete!");
        process.exit(0);

    } catch (err) {
        console.error("Seeding Failed:", err);
        process.exit(1);
    }
}

seedStudents();
