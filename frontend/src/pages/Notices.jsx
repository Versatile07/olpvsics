import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function Notices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/notices');
        setNotices(res.data);
      } catch (err) {
        console.error('Failed to fetch notices:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="page-wrapper" style={{ padding: '40px 48px', maxWidth: '900px', margin: '0 auto' }}>
      <div className="page-header">
        <h1 className="page-title">📢 Notices</h1>
        <Link to="/dashboard" className="back-link">← Dashboard</Link>
      </div>

      {loading ? <p style={{ color: 'var(--text-500)' }}>Loading...</p> : notices.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px' }}>
          <p style={{ color: 'var(--text-500)' }}>No notices posted yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {notices.map(n => (
            <div key={n.id} className="card" style={{ padding: '20px 24px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--text-900)', margin: '0 0 8px 0' }}>{n.title}</h3>
              <p style={{ fontSize: '15px', color: 'var(--text-700)', lineHeight: 1.6, margin: '0 0 10px 0' }}>{n.body}</p>
              <p style={{ fontSize: '12px', color: 'var(--text-300)', margin: 0 }}>
                Posted by: {n.posted_by_name || 'N/A'} • {new Date(n.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
