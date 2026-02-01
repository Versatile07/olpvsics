import { db } from "./config/db.js";

const subjects = [
    // Semester 1
    { name: "Computer Fundamental & Problem Solving", code: "BCA101", semester: 1 },
    { name: "C Programming", code: "BCA102", semester: 1 },
    { name: "Principles of Management", code: "BCA103", semester: 1 },
    { name: "Business Communication", code: "BCA104", semester: 1 },
    { name: "Mathematics-I", code: "BCA105", semester: 1 },

    // Semester 2
    { name: "Object Oriented Programming using C++", code: "BCA201", semester: 2 },
    { name: "Data Structures & Algorithms", code: "BCA202", semester: 2 },
    { name: "Mathematics-II", code: "BCA203", semester: 2 },
    { name: "Financial Accounting & Management", code: "BCA204", semester: 2 },
    { name: "Computer Organization", code: "BCA205", semester: 2 },

    // Semester 3
    { name: "Python Programming", code: "BCA301", semester: 3 },
    { name: "Operating System", code: "BCA302", semester: 3 },
    { name: "Emerging Technologies", code: "BCA303", semester: 3 },
    { name: "Internet & Web Technology", code: "BCA304", semester: 3 },
    { name: "Software Engineering", code: "BCA305", semester: 3 },

    // Semester 4
    { name: "Computer Graphics & Animation", code: "BCA401", semester: 4 },
    { name: "Database Management System", code: "BCA402", semester: 4 },
    { name: "Optimization Techniques", code: "BCA403", semester: 4 },
    { name: "Mathematics-III", code: "BCA404", semester: 4 },
    { name: "Cyber Security", code: "BCA405", semester: 4 },

    // Semester 5
    { name: "Java Programming", code: "BCA501", semester: 5 },
    { name: "Computer Network", code: "BCA502", semester: 5 },
    { name: "Numerical Methods", code: "BCA503", semester: 5 },
    { name: "Minor Project", code: "BCA504", semester: 5 },

    // Semester 6
    { name: "Major Project", code: "BCA601", semester: 6 },
    { name: "Information Security", code: "BCA602", semester: 6 },
    { name: "E-Commerce", code: "BCA603", semester: 6 }
];

async function seedSubjects() {
    try {
        // 1. Get Faculty ID
        const [faculty] = await db.query("SELECT id FROM users WHERE email = ?", ["sharma@vsics.edu"]);

        if (faculty.length === 0) {
            console.error("Faculty user (sharma@vsics.edu) not found! Cannot assign subjects.");
            process.exit(1);
        }

        const facultyId = faculty[0].id;
        console.log(`Assigning subjects to Faculty ID: ${facultyId}`);

        // 2. Insert Subjects
        for (const sub of subjects) {
            try {
                await db.query(
                    `INSERT INTO subjects (name, code, semester, faculty_id) VALUES (?, ?, ?, ?)`,
                    [sub.name, sub.code, sub.semester, facultyId]
                );
                console.log(`Added: ${sub.name} (${sub.code})`);
            } catch (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    console.log(`Skipped (Duplicate): ${sub.name}`);
                } else {
                    console.error(`Error adding ${sub.name}:`, err.message);
                }
            }
        }

        console.log("\nSubject seeding complete!");
        process.exit(0);
    } catch (err) {
        console.error("Script failed:", err);
        process.exit(1);
    }
}

seedSubjects();
