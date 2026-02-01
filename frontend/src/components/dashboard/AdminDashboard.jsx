import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
    const navigate = useNavigate();

    return (
        <div className="admin-dashboard">
            <div className="welcome-section">
                <h2>Admin Dashboard</h2>
                <p>Manage placements, notices, and system settings</p>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
                <button className="action-btn">
                    📢 Post Notice
                </button>
                <button className="action-btn">
                    💼 Add Placement
                </button>
                <button className="action-btn secondary">
                    👥 Manage Users
                </button>
            </div>

            {/* Stats */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="label">Total Students</div>
                    <div className="value">--</div>
                </div>
                <div className="stat-card">
                    <div className="label">Total Faculty</div>
                    <div className="value">--</div>
                </div>
                <div className="stat-card">
                    <div className="label">Active Placements</div>
                    <div className="value">--</div>
                </div>
                <div className="stat-card">
                    <div className="label">Recent Notices</div>
                    <div className="value">--</div>
                </div>
            </div>

            {/* Module Cards */}
            <h3 className="section-title">Modules</h3>
            <div className="dashboard-grid">
                <div className="module-card placements" onClick={() => navigate("/placements")}>
                    <div className="icon">💼</div>
                    <h3>Placements</h3>
                    <p>Post jobs, internships, and workshops. Manage all placement activities.</p>
                </div>

                <div className="module-card notices" onClick={() => navigate("/notices")}>
                    <div className="icon">📢</div>
                    <h3>Notices</h3>
                    <p>Create and manage announcements for students and faculty.</p>
                </div>

                <div className="module-card notes" onClick={() => navigate("/notes")}>
                    <div className="icon">📚</div>
                    <h3>Study Materials</h3>
                    <p>View all uploaded notes and papers across departments.</p>
                </div>

                <div className="module-card attendance">
                    <div className="icon">📊</div>
                    <h3>Reports</h3>
                    <p>View attendance reports and system analytics.</p>
                </div>
            </div>

            {/* Recent Activity */}
            <h3 className="section-title">Recent Activity</h3>
            <div className="notice-card">
                <h4>System initialized</h4>
                <p>Welcome to VSICS Online Learning Portal admin panel.</p>
                <div className="meta">Just now</div>
            </div>
        </div>
    );
};

export default AdminDashboard;
