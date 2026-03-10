import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Dashboard.css';

const navItems = [
  { path: '/resources', label: '📚 Resources', roles: ['admin', 'faculty', 'student'] },
  { path: '/upload-resource', label: '📤 Upload Resource', roles: ['faculty', 'admin'] },
  { path: '/attendance', label: '📋 Attendance', roles: ['admin', 'faculty', 'student'] },
  { path: '/assignments', label: '📝 Assignments', roles: ['admin', 'faculty', 'student'] },
  { path: '/placements', label: '💼 Placements', roles: ['admin', 'faculty', 'student'] },
  { path: '/notices', label: '📢 Notices', roles: ['admin', 'faculty', 'student'] },
  { path: '/external-courses', label: '🌐 External Courses', roles: ['admin', 'faculty', 'student'] },
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
          <span style={{ color: '#aaa', marginRight: '1rem' }}>{user?.name}</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      <main className="dashboard-main" style={{ padding: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem', color: '#fff' }}>Welcome, {user?.name}!</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
          {navItems
            .filter(item => item.roles.includes(user?.role))
            .map(item => (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'block',
                  padding: '1.5rem',
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff',
                  textDecoration: 'none',
                  fontSize: '1.1rem',
                  transition: 'all 0.2s',
                }}
                onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
              >
                {item.label}
              </Link>
            ))}
        </div>
      </main>
    </div>
  );
}
