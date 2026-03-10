import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function Placements() {
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/placements');
        setPlacements(res.data);
      } catch (err) {
        console.error('Failed to fetch placements:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="page-wrapper" style={{ padding: '40px 48px', maxWidth: '900px', margin: '0 auto' }}>
      <div className="page-header">
        <h1 className="page-title">💼 Placements</h1>
        <Link to="/dashboard" className="back-link">← Dashboard</Link>
      </div>

      {loading ? <p style={{ color: 'var(--text-500)' }}>Loading...</p> : placements.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px' }}>
          <p style={{ color: 'var(--text-500)' }}>No placements posted yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {placements.map(p => (
            <div key={p.id} className="card" style={{ padding: '20px 24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--text-900)', margin: '0 0 2px 0' }}>{p.title}</h3>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--brand-blue-500)', margin: '0 0 6px 0' }}>{p.company}</p>
                  {p.description && <p style={{ fontSize: '14px', color: 'var(--text-700)', margin: '0 0 8px 0', lineHeight: 1.5 }}>{p.description}</p>}
                </div>
                {p.deadline && (
                  <span className="badge" style={{ flexShrink: 0 }}>📅 {new Date(p.deadline).toLocaleDateString()}</span>
                )}
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-300)', margin: 0 }}>Posted by: {p.posted_by_name || 'N/A'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
