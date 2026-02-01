const API_URL = "http://localhost:5000/api";

const facultyRef = {
    email: "iqbal@vsics.edu",
    password: "IqbalBCA102"
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
        console.log("Login Success!");

        // 2. Get Subjects
        console.log("Fetching subjects from /api/subjects/my ...");
        const subjectsRes = await fetch(`${API_URL}/subjects/my`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const text = await subjectsRes.text();
        console.log("Response Status:", subjectsRes.status);
        console.log("Response Text Preview:", text.substring(0, 500));

        if (subjectsRes.ok) {
            const json = JSON.parse(text);
            console.log("Subjects found:", json.length);
        }

    } catch (err) {
        console.error("Test Failed:", err.message);
    }
}

testFlow();
