import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

export default function UploadResource() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', subject_id: '', year: '', type: 'note', url: '' });
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title) {
      setMessage('Title is required');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      if (form.subject_id) formData.append('subject_id', form.subject_id);
      if (form.year) formData.append('year', form.year);
      formData.append('type', form.type);
      if (form.url) formData.append('url', form.url);
      if (file) formData.append('file', file);

      await api.post('/resources', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setMessage('Resource uploaded successfully!');
      setTimeout(() => navigate('/resources'), 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { padding: '0.5rem', borderRadius: '6px', border: '1px solid #555', background: '#222', color: '#fff', width: '100%' };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h1>📤 Upload Resource</h1>
        <Link to="/resources" style={{ color: '#aaa' }}>← Resources</Link>
      </div>

      {message && <div style={{ padding: '0.75rem', marginBottom: '1rem', borderRadius: '6px', background: message.includes('success') ? '#143' : '#411', color: '#fff' }}>{message}</div>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.25rem', color: '#ccc' }}>Title *</label>
          <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required style={inputStyle} />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.25rem', color: '#ccc' }}>Subject ID</label>
          <input value={form.subject_id} onChange={e => setForm(f => ({ ...f, subject_id: e.target.value }))} style={inputStyle} />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.25rem', color: '#ccc' }}>Year</label>
          <input value={form.year} onChange={e => setForm(f => ({ ...f, year: e.target.value }))} style={inputStyle} />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.25rem', color: '#ccc' }}>Type</label>
          <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} style={inputStyle}>
            <option value="note">Note</option>
            <option value="paper">Paper</option>
          </select>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.25rem', color: '#ccc' }}>URL (optional, alternative to file)</label>
          <input value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} style={inputStyle} />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.25rem', color: '#ccc' }}>File</label>
          <input type="file" onChange={e => setFile(e.target.files[0])} style={{ color: '#fff' }} />
        </div>

        <button type="submit" disabled={loading} style={{ padding: '0.75rem 2rem', borderRadius: '8px', background: '#4f9', border: 'none', cursor: 'pointer', fontSize: '1rem' }}>
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
    </div>
  );
}
