import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Assignments() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  const fetchAssignments = async () => {
    try {
      const res = await api.get('/assignments');
      setAssignments(res.data);
    } catch (err) {
      console.error('Failed to fetch assignments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAssignments(); }, []);

  return (
    <div className="page-wrapper" style={{ padding: '40px 48px', maxWidth: '900px', margin: '0 auto' }}>
      <div className="page-header">
        <h1 className="page-title">📝 Assignments</h1>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {(user?.role === 'faculty' || user?.role === 'admin') && (
            <button onClick={() => setShowCreate(!showCreate)} className={showCreate ? 'btn-secondary' : 'btn-primary'} style={{ fontSize: '14px', height: '40px', padding: '8px 18px' }}>
              {showCreate ? 'Cancel' : '+ Create'}
            </button>
          )}
          <Link to="/dashboard" className="back-link">← Dashboard</Link>
        </div>
      </div>

      {showCreate && <CreateAssignment onCreated={() => { setShowCreate(false); fetchAssignments(); }} />}

      {loading ? <p style={{ color: 'var(--text-500)' }}>Loading...</p> : assignments.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px' }}>
          <p style={{ color: 'var(--text-500)' }}>No assignments found.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {assignments.map(a => <AssignmentCard key={a.id} assignment={a} userRole={user?.role} />)}
        </div>
      )}
    </div>
  );
}

function CreateAssignment({ onCreated }) {
  const [form, setForm] = useState({ title: '', description: '', subject_id: '', deadline: '' });
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.subject_id) { setMessage('Title and Subject ID required'); return; }
    try {
      await api.post('/assignments', form);
      setMessage('Created!');
      setTimeout(onCreated, 500);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed');
    }
  };

  return (
    <div className="card" style={{ padding: '24px', marginBottom: '24px', background: 'var(--bg-pale)' }}>
      <h4 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--text-900)', marginBottom: '16px' }}>Create Assignment</h4>
      {message && <div className={`alert ${message === 'Created!' ? 'alert-success' : 'alert-error'}`}>{message}</div>}
      <form onSubmit={handleSubmit}>
        <input className="input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Title *" required style={{ marginBottom: '12px' }} />
        <textarea className="textarea" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Description" style={{ marginBottom: '12px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
          <input className="input" value={form.subject_id} onChange={e => setForm(f => ({ ...f, subject_id: e.target.value }))} placeholder="Subject ID *" required />
          <input className="input" type="datetime-local" value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))} />
        </div>
        <button type="submit" className="btn-primary" style={{ height: '40px', fontSize: '14px' }}>Create</button>
      </form>
    </div>
  );
}

function AssignmentCard({ assignment: a, userRole }) {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    if (!file) { setMessage('Select a file first'); return; }
    const formData = new FormData();
    formData.append('file', file);
    try {
      await api.post(`/assignments/${a.id}/submit`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setMessage('Submitted!');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed');
    }
  };

  return (
    <div className="card" style={{ padding: '20px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--text-900)', margin: '0 0 4px 0' }}>{a.title}</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-500)', margin: '0 0 4px 0' }}>
            Subject: {a.subject_name || a.subject_id} • Faculty: {a.faculty_name || 'N/A'} • Deadline: {a.deadline ? new Date(a.deadline).toLocaleString() : 'None'}
          </p>
          {a.description && <p style={{ fontSize: '14px', color: 'var(--text-700)', margin: '8px 0 0 0', lineHeight: 1.5 }}>{a.description}</p>}
        </div>
      </div>

      {userRole === 'student' && (
        <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <input type="file" onChange={e => setFile(e.target.files[0])} style={{ fontSize: '13px', color: 'var(--text-700)', flex: 1 }} />
          <button onClick={handleSubmit} className="btn-primary" style={{ height: '36px', fontSize: '13px', padding: '6px 16px' }}>Submit</button>
          {message && <span style={{ fontSize: '13px', fontWeight: 600, color: message === 'Submitted!' ? '#0d9654' : '#d93025' }}>{message}</span>}
        </div>
      )}
    </div>
  );
}
