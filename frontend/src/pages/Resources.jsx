import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Resources() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);
  const [filters, setFilters] = useState({ subject_id: '', year: '', type: '' });
  const [loading, setLoading] = useState(false);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.subject_id) params.subject_id = filters.subject_id;
      if (filters.year) params.year = filters.year;
      if (filters.type) params.type = filters.type;
      const res = await api.get('/resources', { params });
      setResources(res.data);
    } catch (err) {
      console.error('Failed to fetch resources:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchResources(); }, []);

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1>📚 Resources</h1>
        <div>
          {(user?.role === 'faculty' || user?.role === 'admin') && (
            <Link to="/upload-resource" style={{ marginRight: '1rem', color: '#4f9' }}>+ Upload</Link>
          )}
          <Link to="/dashboard" style={{ color: '#aaa' }}>← Dashboard</Link>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <input
          placeholder="Subject ID"
          value={filters.subject_id}
          onChange={e => setFilters(f => ({ ...f, subject_id: e.target.value }))}
          style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #555', background: '#222', color: '#fff' }}
        />
        <input
          placeholder="Year"
          value={filters.year}
          onChange={e => setFilters(f => ({ ...f, year: e.target.value }))}
          style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #555', background: '#222', color: '#fff' }}
        />
        <select
          value={filters.type}
          onChange={e => setFilters(f => ({ ...f, type: e.target.value }))}
          style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #555', background: '#222', color: '#fff' }}
        >
          <option value="">All Types</option>
          <option value="note">Notes</option>
          <option value="paper">Papers</option>
        </select>
        <button onClick={fetchResources} style={{ padding: '0.5rem 1rem', borderRadius: '6px', background: '#4f9', border: 'none', cursor: 'pointer' }}>
          Filter
        </button>
      </div>

      {loading ? <p>Loading...</p> : (
        <div>
          {resources.length === 0 ? (
            <p style={{ color: '#aaa' }}>No resources found.</p>
          ) : (
            resources.map(r => (
              <div key={r.id} style={{ padding: '1rem', marginBottom: '0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <h3 style={{ margin: 0 }}>{r.title}</h3>
                <p style={{ color: '#aaa', fontSize: '0.85rem', margin: '0.25rem 0' }}>
                  {r.type === 'paper' ? '📄 Paper' : '📝 Note'} | Subject: {r.subject_name || r.subject_id} | Year: {r.year || 'N/A'}
                </p>
                <p style={{ color: '#888', fontSize: '0.8rem' }}>Uploaded by: {r.uploader_name || 'Unknown'}</p>
                {r.filename && (
                  <a href={`http://localhost:5000/uploads/${r.filename}`} target="_blank" rel="noreferrer" style={{ color: '#4cf' }}>
                    ⬇ Download
                  </a>
                )}
                {r.url && (
                  <a href={r.url} target="_blank" rel="noreferrer" style={{ color: '#4cf', marginLeft: '1rem' }}>
                    🔗 Link
                  </a>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
