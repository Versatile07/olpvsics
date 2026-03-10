import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Dashboard.css';

const navItems = [
  { path: '/resources', label: 'Resources', icon: '📚', desc: 'Notes & Papers', roles: ['admin', 'faculty', 'student'] },
  { path: '/upload-resource', label: 'Upload Resource', icon: '📤', desc: 'Share study material', roles: ['faculty', 'admin'] },
  { path: '/attendance', label: 'Attendance', icon: '📋', desc: 'Track & manage', roles: ['admin', 'faculty', 'student'] },
  { path: '/assignments', label: 'Assignments', icon: '📝', desc: 'Create & submit', roles: ['admin', 'faculty', 'student'] },
  { path: '/placements', label: 'Placements', icon: '💼', desc: 'Opportunities', roles: ['admin', 'faculty', 'student'] },
  { path: '/notices', label: 'Notices', icon: '📢', desc: 'Announcements', roles: ['admin', 'faculty', 'student'] },
  { path: '/external-courses', label: 'External Courses', icon: '🌐', desc: 'Enroll & certify', roles: ['admin', 'faculty', 'student'] },
];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const roleLabel = { admin: 'Administrator', faculty: 'Faculty', student: 'Student' };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-left">
          <h1 className="logo">VSICS Portal</h1>
        </div>
        <div className="header-right">
          <span className="role-badge">{roleLabel[user?.role] || user?.role}</span>
          <span style={{ color: 'var(--text-500)', fontSize: '14px' }}>{user?.name}</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      <main className="dashboard-main">
        <h2 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-900)', marginBottom: '8px' }}>Welcome, {user?.name}!</h2>
        <p style={{ color: 'var(--text-500)', marginBottom: '32px', fontSize: '15px' }}>What would you like to do today?</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
          {navItems
            .filter(item => item.roles.includes(user?.role))
            .map(item => (
              <Link
                key={item.path}
                to={item.path}
                className="card"
                style={{ display: 'block', textDecoration: 'none', padding: '24px' }}
              >
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>{item.icon}</div>
                <h3 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--text-900)', margin: '0 0 4px 0' }}>{item.label}</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-500)', margin: 0 }}>{item.desc}</p>
              </Link>
            ))}
        </div>
      </main>
    </div>
  );
}
