import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Resources() {
  const { user } = useAuth();
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
    <div className="page-wrapper" style={{ padding: '40px 48px', maxWidth: '1000px', margin: '0 auto' }}>
      <div className="page-header">
        <h1 className="page-title">📚 Resources</h1>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          {(user?.role === 'faculty' || user?.role === 'admin') && (
            <Link to="/upload-resource" className="btn-primary" style={{ fontSize: '14px', height: '40px', padding: '8px 18px', textDecoration: 'none' }}>+ Upload</Link>
          )}
          <Link to="/dashboard" className="back-link">← Dashboard</Link>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <input className="input" placeholder="Subject ID" value={filters.subject_id} onChange={e => setFilters(f => ({ ...f, subject_id: e.target.value }))} style={{ flex: '1', minWidth: '120px', maxWidth: '180px' }} />
        <input className="input" placeholder="Year" value={filters.year} onChange={e => setFilters(f => ({ ...f, year: e.target.value }))} style={{ flex: '1', minWidth: '100px', maxWidth: '140px' }} />
        <select className="select" value={filters.type} onChange={e => setFilters(f => ({ ...f, type: e.target.value }))} style={{ flex: '1', minWidth: '120px', maxWidth: '160px' }}>
          <option value="">All Types</option>
          <option value="note">Notes</option>
          <option value="paper">Papers</option>
        </select>
        <button onClick={fetchResources} className="btn-primary" style={{ height: '48px' }}>Filter</button>
      </div>

      {loading ? <p style={{ color: 'var(--text-500)' }}>Loading...</p> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {resources.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '48px' }}>
              <p style={{ color: 'var(--text-500)', fontSize: '15px' }}>No resources found. Try adjusting your filters.</p>
            </div>
          ) : (
            resources.map(r => (
              <div key={r.id} className="card" style={{ padding: '20px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ fontSize: '17px', fontWeight: 600, margin: '0 0 4px 0', color: 'var(--text-900)' }}>{r.title}</h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-500)', margin: '0 0 4px 0' }}>
                      <span className="badge" style={{ marginRight: '8px' }}>{r.type === 'paper' ? '📄 Paper' : '📝 Note'}</span>
                      Subject: {r.subject_name || r.subject_id || 'N/A'} • Year: {r.year || 'N/A'}
                    </p>
                    <p style={{ fontSize: '12px', color: 'var(--text-300)', margin: 0 }}>Uploaded by: {r.uploader_name || 'Unknown'}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {r.filename && (
                      <a href={`http://localhost:5000/uploads/${r.filename}`} target="_blank" rel="noreferrer" className="btn-secondary" style={{ fontSize: '13px', height: '36px', padding: '6px 14px' }}>⬇ Download</a>
                    )}
                    {r.url && (
                      <a href={r.url} target="_blank" rel="noreferrer" className="btn-secondary" style={{ fontSize: '13px', height: '36px', padding: '6px 14px' }}>🔗 Link</a>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
