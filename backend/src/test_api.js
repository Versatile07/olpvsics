const API_URL = "http://localhost:5000/api";

const facultyRef = {
    email: "rekh@vsics.edu",
    password: "RekhBCA402"
};

async function testFlow() {
    try {
        // 1. Login
        console.log("Logging in as:", facultyRef.email);
        const loginRes = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(facultyRef)
        });

        if (!loginRes.ok) throw new Error("Login failed");

        const loginData = await loginRes.json();
        const token = loginData.token;
        console.log("Login Success! Token obtained.");

        // 2. Get Subjects
        console.log("Fetching subjects...");
        const subjectsRes = await fetch(`${API_URL}/subjects`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const subjects = await subjectsRes.json();
        console.log("Subjects fetched:", subjects.length);
        subjects.forEach(s => console.log(` - ${s.code}: ${s.name}`));

    } catch (err) {
        console.error("Test Failed:", err.message);
    }
}

testFlow();
