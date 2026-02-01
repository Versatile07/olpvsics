import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const StudentDashboard = () => {
    const navigate = useNavigate();

    return (
        <div className="student-dashboard">
            <div className="welcome-section">
                <h2>Student Dashboard</h2>
                <p>Access materials, check attendance, and submit assignments</p>
            </div>

            {/* Stats */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="label">Overall Attendance</div>
                    <div className="value">--%</div>
                </div>
                <div className="stat-card">
                    <div className="label">Pending Assignments</div>
                    <div className="value">--</div>
                </div>
                <div className="stat-card">
                    <div className="label">Downloaded Materials</div>
                    <div className="value">--</div>
                </div>
                <div className="stat-card">
                    <div className="label">Active Placements</div>
                    <div className="value">--</div>
                </div>
            </div>

            {/* Module Cards */}
            <h3 className="section-title">Modules</h3>
            <div className="dashboard-grid">
                <div className="module-card notes" onClick={() => navigate("/notes")}>
                    <div className="icon">📚</div>
                    <h3>Study Materials</h3>
                    <p>Download lecture notes, slides, and reference materials.</p>
                </div>

                <div className="module-card papers" onClick={() => navigate("/notes")}>
                    <div className="icon">📄</div>
                    <h3>Previous Year Papers</h3>
                    <p>Access previous year question papers for exam preparation.</p>
                </div>

                <div className="module-card attendance" onClick={() => navigate("/attendance")}>
                    <div className="icon">📊</div>
                    <h3>My Attendance</h3>
                    <p>View your attendance percentage for each subject.</p>
                </div>

                <div className="module-card assignments" onClick={() => navigate("/assignments")}>
                    <div className="icon">📝</div>
                    <h3>Assignments</h3>
                    <p>View pending assignments and submit your work before deadlines.</p>
                </div>

                <div className="module-card placements" onClick={() => navigate("/placements")}>
                    <div className="icon">💼</div>
                    <h3>Placements</h3>
                    <p>Explore job opportunities, internships, and workshops.</p>
                </div>

                <div className="module-card notices" onClick={() => navigate("/notices")}>
                    <div className="icon">📢</div>
                    <h3>Notices</h3>
                    <p>Stay updated with college announcements and events.</p>
                </div>
            </div>

            {/* Urgent Notices */}
            <h3 className="section-title">Recent Notices</h3>
            <div className="notice-card important">
                <h4>Welcome to VSICS Portal</h4>
                <p>Complete your profile and start exploring the learning platform.</p>
                <div className="meta">Today</div>
            </div>

            {/* Upcoming Deadlines */}
            <h3 className="section-title">Upcoming Deadlines</h3>
            <div className="notice-card">
                <h4>No upcoming deadlines</h4>
                <p>Assignment deadlines will appear here.</p>
                <div className="meta">--</div>
            </div>
        </div>
    );
};

export default StudentDashboard;
