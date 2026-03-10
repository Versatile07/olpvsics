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
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h1>📢 Notices</h1>
        <Link to="/dashboard" style={{ color: '#aaa' }}>← Dashboard</Link>
      </div>

      {loading ? <p>Loading...</p> : notices.length === 0 ? (
        <p style={{ color: '#aaa' }}>No notices posted yet.</p>
      ) : (
        notices.map(n => (
          <div key={n.id} style={{ padding: '1rem', marginBottom: '0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <h3 style={{ margin: 0 }}>{n.title}</h3>
            <p style={{ color: '#ccc', fontSize: '0.9rem', margin: '0.5rem 0' }}>{n.body}</p>
            <p style={{ color: '#aaa', fontSize: '0.8rem' }}>
              Posted by: {n.posted_by_name || 'N/A'} | {new Date(n.created_at).toLocaleString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
