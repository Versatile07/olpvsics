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
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h1>📝 Assignments</h1>
        <div>
          {(user?.role === 'faculty' || user?.role === 'admin') && (
            <button onClick={() => setShowCreate(!showCreate)} style={{ marginRight: '1rem', padding: '0.5rem 1rem', background: '#4f9', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
              {showCreate ? 'Cancel' : '+ Create'}
            </button>
          )}
          <Link to="/dashboard" style={{ color: '#aaa' }}>← Dashboard</Link>
        </div>
      </div>

      {showCreate && <CreateAssignment onCreated={() => { setShowCreate(false); fetchAssignments(); }} />}

      {loading ? <p>Loading...</p> : assignments.length === 0 ? (
        <p style={{ color: '#aaa' }}>No assignments found.</p>
      ) : (
        assignments.map(a => (
          <AssignmentCard key={a.id} assignment={a} userRole={user?.role} />
        ))
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

  const inputStyle = { padding: '0.5rem', borderRadius: '6px', border: '1px solid #555', background: '#222', color: '#fff', width: '100%' };

  return (
    <div style={{ padding: '1rem', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
      <h3>Create Assignment</h3>
      {message && <p style={{ color: message === 'Created!' ? '#4f9' : '#f44' }}>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Title *" required style={{ ...inputStyle, marginBottom: '0.5rem' }} />
        <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Description" style={{ ...inputStyle, marginBottom: '0.5rem', minHeight: '60px' }} />
        <input value={form.subject_id} onChange={e => setForm(f => ({ ...f, subject_id: e.target.value }))} placeholder="Subject ID *" required style={{ ...inputStyle, marginBottom: '0.5rem' }} />
        <input type="datetime-local" value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))} style={{ ...inputStyle, marginBottom: '0.5rem' }} />
        <button type="submit" style={{ padding: '0.5rem 1.5rem', background: '#4f9', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Create</button>
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
    <div style={{ padding: '1rem', marginBottom: '0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
      <h3 style={{ margin: 0 }}>{a.title}</h3>
      <p style={{ color: '#aaa', fontSize: '0.85rem' }}>Subject: {a.subject_name || a.subject_id} | Faculty: {a.faculty_name || 'N/A'} | Deadline: {a.deadline ? new Date(a.deadline).toLocaleString() : 'None'}</p>
      {a.description && <p style={{ color: '#ccc', fontSize: '0.9rem' }}>{a.description}</p>}

      {userRole === 'student' && (
        <div style={{ marginTop: '0.5rem' }}>
          <input type="file" onChange={e => setFile(e.target.files[0])} style={{ color: '#fff', marginRight: '0.5rem' }} />
          <button onClick={handleSubmit} style={{ padding: '0.3rem 1rem', background: '#4cf', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Submit</button>
          {message && <span style={{ marginLeft: '0.5rem', color: message === 'Submitted!' ? '#4f9' : '#f44' }}>{message}</span>}
        </div>
      )}
    </div>
  );
}
