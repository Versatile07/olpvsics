import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout, getRole, isAuthenticated, decodeToken } from "../utils/auth";
import "../styles/Dashboard.css";

// Dashboard Components for each role
import AdminDashboard from "../components/dashboard/AdminDashboard";
import FacultyDashboard from "../components/dashboard/FacultyDashboard";
import StudentDashboard from "../components/dashboard/StudentDashboard";

const Dashboard = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/");
      return;
    }

    const userRole = getRole();
    if (!userRole) {
      logout();
      return;
    }

    setRole(userRole);
    setLoading(false);
  }, [navigate]);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  const renderDashboard = () => {
    switch (role) {
      case "admin":
        return <AdminDashboard />;
      case "faculty":
        return <FacultyDashboard />;
      case "student":
        return <StudentDashboard />;
      default:
        return <p>Unknown role. Please contact administrator.</p>;
    }
  };

  const getRoleLabel = () => {
    const labels = {
      admin: "Administrator",
      faculty: "Faculty",
      student: "Student"
    };
    return labels[role] || role;
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <h1 className="logo">VSICS Portal</h1>
        </div>
        <div className="header-right">
          <span className="role-badge">{getRoleLabel()}</span>
          <button onClick={logout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        {renderDashboard()}
      </main>
    </div>
  );
};

export default Dashboard;
