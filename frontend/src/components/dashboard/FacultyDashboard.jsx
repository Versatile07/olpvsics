import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const FacultyDashboard = () => {
    const navigate = useNavigate();

    return (
        <div className="faculty-dashboard">
            <div className="welcome-section">
                <h2>Faculty Dashboard</h2>
                <p>Upload materials, mark attendance, and manage assignments</p>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
                <button className="action-btn">
                    📤 Upload Notes
                </button>
                <button className="action-btn">
                    ✅ Mark Attendance
                </button>
                <button className="action-btn secondary">
                    📝 Create Assignment
                </button>
            </div>

            {/* Stats */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="label">My Subjects</div>
                    <div className="value">--</div>
                </div>
                <div className="stat-card">
                    <div className="label">Materials Uploaded</div>
                    <div className="value">--</div>
                </div>
                <div className="stat-card">
                    <div className="label">Pending Submissions</div>
                    <div className="value">--</div>
                </div>
                <div className="stat-card">
                    <div className="label">Classes Today</div>
                    <div className="value">--</div>
                </div>
            </div>

            {/* Module Cards */}
            <h3 className="section-title">Modules</h3>
            <div className="dashboard-grid">
                <div className="module-card notes" onClick={() => navigate("/notes")}>
                    <div className="icon">📚</div>
                    <h3>Study Materials</h3>
                    <p>Upload notes, lecture slides, and reference materials for students.</p>
                </div>

                <div className="module-card papers" onClick={() => navigate("/notes")}>
                    <div className="icon">📄</div>
                    <h3>Previous Year Papers</h3>
                    <p>Upload and organize previous year question papers.</p>
                </div>

                <div className="module-card attendance" onClick={() => navigate("/attendance")}>
                    <div className="icon">✅</div>
                    <h3>Attendance</h3>
                    <p>Mark daily attendance and view attendance reports.</p>
                </div>

                <div className="module-card assignments" onClick={() => navigate("/assignments")}>
                    <div className="icon">📝</div>
                    <h3>Assignments</h3>
                    <p>Create assignments, set deadlines, and review submissions.</p>
                </div>

                <div className="module-card notices" onClick={() => navigate("/notices")}>
                    <div className="icon">📢</div>
                    <h3>Notices</h3>
                    <p>Post announcements for your students.</p>
                </div>
            </div>

            {/* Recent Submissions */}
            <h3 className="section-title">Recent Submissions</h3>
            <div className="notice-card">
                <h4>No pending submissions</h4>
                <p>Assignment submissions will appear here for review.</p>
                <div className="meta">--</div>
            </div>
        </div>
    );
};

export default FacultyDashboard;
