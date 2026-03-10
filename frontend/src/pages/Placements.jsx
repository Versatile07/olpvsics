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
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h1>💼 Placements</h1>
        <Link to="/dashboard" style={{ color: '#aaa' }}>← Dashboard</Link>
      </div>

      {loading ? <p>Loading...</p> : placements.length === 0 ? (
        <p style={{ color: '#aaa' }}>No placements posted yet.</p>
      ) : (
        placements.map(p => (
          <div key={p.id} style={{ padding: '1rem', marginBottom: '0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <h3 style={{ margin: 0 }}>{p.title}</h3>
            <p style={{ color: '#4cf', margin: '0.25rem 0' }}>{p.company}</p>
            {p.description && <p style={{ color: '#ccc', fontSize: '0.9rem' }}>{p.description}</p>}
            <p style={{ color: '#aaa', fontSize: '0.8rem' }}>
              Deadline: {p.deadline ? new Date(p.deadline).toLocaleDateString() : 'N/A'} | Posted by: {p.posted_by_name || 'N/A'}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
