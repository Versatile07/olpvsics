import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

export default function UploadResource() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', subject_id: '', year: '', type: 'note', url: '' });
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    api.get('/subjects')
      .then(res => {
        setSubjects(res.data);
      })
      .catch(err => console.error('Failed to load subjects', err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title) { setMessage('Title is required'); return; }
    if (!form.subject_id) { setMessage('Please select a subject'); return; }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('subject_id', form.subject_id);
      if (form.year) formData.append('year', form.year);
      formData.append('type', form.type);
      if (form.url) formData.append('url', form.url);
      if (file) formData.append('file', file);
      await api.post('/resources', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setMessage('Resource uploaded successfully!');
      setTimeout(() => navigate('/resources'), 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper" style={{ padding: '40px 48px', maxWidth: '640px', margin: '0 auto' }}>
      <div className="page-header">
        <h1 className="page-title">📤 Upload Resource</h1>
        <Link to="/resources" className="back-link">← Resources</Link>
      </div>

      {message && <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'}`}>{message}</div>}

      <div className="card" style={{ padding: '32px' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-500)', marginBottom: '6px' }}>Title *</label>
            <input className="input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-500)', marginBottom: '6px' }}>Subject *</label>
              <select className="select" value={form.subject_id} onChange={e => setForm(f => ({ ...f, subject_id: e.target.value }))} required>
                <option value="">Select a subject...</option>
                {subjects.map(sub => (
                  <option key={sub.id} value={sub.id}>{sub.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-500)', marginBottom: '6px' }}>Year</label>
              <input className="input" value={form.year} onChange={e => setForm(f => ({ ...f, year: e.target.value }))} placeholder="e.g. 2024" />
            </div>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-500)', marginBottom: '6px' }}>Type</label>
            <select className="select" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
              <option value="note">Note</option>
              <option value="paper">Paper</option>
            </select>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-500)', marginBottom: '6px' }}>URL (optional)</label>
            <input className="input" value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} placeholder="https://..." />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-500)', marginBottom: '6px' }}>File</label>
            <input type="file" onChange={e => setFile(e.target.files[0])} style={{ fontSize: '14px', color: 'var(--text-700)' }} />
          </div>
          <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%' }}>
            {loading ? 'Uploading...' : 'Upload Resource'}
          </button>
        </form>
      </div>
    </div>
  );
}
