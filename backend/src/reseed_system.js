import { db } from "./config/db.js";
import bcrypt from "bcrypt";

// Faculty Data with their primary subject code for password generation
const facultyMembers = [
    {
        name: "Dr. Rekh Nath Singh",
        email: "rekh@vsics.edu",
        passwordBase: "RekhBCA402", // DBMS
        department: "Computer Science",
        subjects: ["BCA402", "BCA302", "BCA201"] // DBMS, OS, C++
    },
    {
        name: "Mr. Iqbal Masood Ahmad",
        email: "iqbal@vsics.edu",
        passwordBase: "IqbalBCA102",
        department: "Computer Science",
        subjects: ["BCA102", "BCA202", "BCA101"] // C, DS, Fundamentals
    },
    {
        name: "Mr. Ram Awtar",
        email: "ram@vsics.edu",
        passwordBase: "RamBCA501",
        department: "Computer Science",
        subjects: ["BCA501", "BCA502", "BCA304"] // Java, Networks, Web Tech
    },
    {
        name: "Dr. Aparna Shukla",
        email: "aparna@vsics.edu",
        passwordBase: "AparnaBCA103",
        department: "Management",
        subjects: ["BCA103", "BCA104", "BCA204"] // Mgmt, Comm, Accounts
    },
    {
        name: "Mr. Nitin Mishra",
        email: "nitin@vsics.edu",
        passwordBase: "NitinBCA405",
        department: "Computer Science",
        subjects: ["BCA405", "BCA305", "BCA602", "BCA603"] // Cyber Sec, SE, Info Sec, E-Comm
    },
    {
        name: "Mr. Ashish Kumar Pandey",
        email: "ashish@vsics.edu",
        passwordBase: "AshishBCA105",
        department: "Mathematics",
        subjects: ["BCA105", "BCA203", "BCA404", "BCA503", "BCA403"] // Maths I, II, III, Numerical, Optimization
    },
    {
        name: "Mr. Sanjay Kumar Tiwari",
        email: "sanjay@vsics.edu",
        passwordBase: "SanjayBCA601",
        department: "Computer Science",
        subjects: ["BCA601", "BCA504", "BCA205"] // Major Proj, Minor Proj, CO
    },
    {
        name: "Mrs. Shweta Shukla",
        email: "shweta@vsics.edu",
        passwordBase: "ShwetaBCA301",
        department: "Computer Science",
        subjects: ["BCA301", "BCA303", "BCA401"] // Python, Emerging Tech, Graphics
    }
];

async function reseedSystem() {
    try {
        console.log("Starting System Reseed...");

        // 1. Update Admin & Student Passwords
        const adminPass = "lavi$h.07";
        const studentPass = "lavi5h.07";
        const adminHash = await bcrypt.hash(adminPass, 10);
        const studentHash = await bcrypt.hash(studentPass, 10);

        await db.query("UPDATE users SET password_hash = ? WHERE role = 'admin'", [adminHash]);
        await db.query("UPDATE users SET password_hash = ? WHERE role = 'student'", [studentHash]);
        console.log(`✅ Admin password updated to: ${adminPass}`);
        console.log(`✅ Student password updated to: ${studentPass}`);

        // 2. Delete Existing Faculty
        // Note: This cascades to materials, assignments, etc.
        await db.query("DELETE FROM users WHERE role = 'faculty'");
        console.log("✅ Old faculty users deleted.");

        // 3. Create New Faculty & Assign Subjects
        for (const fac of facultyMembers) {
            const hash = await bcrypt.hash(fac.passwordBase, 10);

            const [result] = await db.query(
                `INSERT INTO users (name, email, password_hash, role, department)
         VALUES (?, ?, ?, 'faculty', ?)`,
                [fac.name, fac.email, hash, fac.department]
            );

            const facultyId = result.insertId;
            console.log(`Created Faculty: ${fac.name} (${fac.email}) - Pass: ${fac.passwordBase}`);

            // Update Subjects
            if (fac.subjects.length > 0) {
                // Build placeholders for IN clause
                const placeholders = fac.subjects.map(() => '?').join(',');
                await db.query(
                    `UPDATE subjects SET faculty_id = ? WHERE code IN (${placeholders})`,
                    [facultyId, ...fac.subjects]
                );
                console.log(`  -> Assigned ${fac.subjects.length} subjects.`);
            }
        }

        console.log("\nRe-seeding Complete! All subjects should now be mapped to real faculty.");
        process.exit(0);

    } catch (err) {
        console.error("Reseed Failed:", err);
        process.exit(1);
    }
}

reseedSystem();
