import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Attendance() {
  const { user } = useAuth();

  if (user?.role === 'faculty' || user?.role === 'admin') {
    return <FacultyAttendance />;
  }
  return <StudentAttendance />;
}

function FacultyAttendance() {
  const [form, setForm] = useState({ subject_id: '', date: '', records: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleMark = async (e) => {
    e.preventDefault();
    if (!form.subject_id || !form.date || !form.records) {
      setMessage('All fields required. Records format: student_id:status,student_id:status');
      return;
    }

    setLoading(true);
    try {
      const records = form.records.split(',').map(r => {
        const [student_id, status] = r.trim().split(':');
        return { student_id: parseInt(student_id), status: status || 'present' };
      });

      await api.post('/attendance/mark', {
        subject_id: parseInt(form.subject_id),
        date: form.date,
        records,
      });

      setMessage('Attendance marked successfully!');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to mark attendance');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { padding: '0.5rem', borderRadius: '6px', border: '1px solid #555', background: '#222', color: '#fff', width: '100%' };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h1>📋 Mark Attendance</h1>
        <Link to="/dashboard" style={{ color: '#aaa' }}>← Dashboard</Link>
      </div>

      {message && <div style={{ padding: '0.75rem', marginBottom: '1rem', borderRadius: '6px', background: message.includes('success') ? '#143' : '#411', color: '#fff' }}>{message}</div>}

      <form onSubmit={handleMark}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.25rem', color: '#ccc' }}>Subject ID *</label>
          <input value={form.subject_id} onChange={e => setForm(f => ({ ...f, subject_id: e.target.value }))} required style={inputStyle} />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.25rem', color: '#ccc' }}>Date *</label>
          <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} required style={inputStyle} />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.25rem', color: '#ccc' }}>Records * (format: id:status,id:status)</label>
          <input value={form.records} onChange={e => setForm(f => ({ ...f, records: e.target.value }))} placeholder="3:present,4:absent" required style={inputStyle} />
        </div>
        <button type="submit" disabled={loading} style={{ padding: '0.75rem 2rem', borderRadius: '8px', background: '#4f9', border: 'none', cursor: 'pointer' }}>
          {loading ? 'Marking...' : 'Mark Attendance'}
        </button>
      </form>
    </div>
  );
}

function StudentAttendance() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/attendance/student/${user.id}`);
        setData(res.data);
      } catch (err) {
        console.error('Failed to fetch attendance:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [user.id]);

  return (
    <div style={{ padding: '2rem', maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h1>📋 My Attendance</h1>
        <Link to="/dashboard" style={{ color: '#aaa' }}>← Dashboard</Link>
      </div>

      {loading ? <p>Loading...</p> : data?.percentages?.length > 0 ? (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #555' }}>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Subject</th>
              <th style={{ padding: '0.75rem', textAlign: 'center' }}>Total</th>
              <th style={{ padding: '0.75rem', textAlign: 'center' }}>Present</th>
              <th style={{ padding: '0.75rem', textAlign: 'center' }}>%</th>
            </tr>
          </thead>
          <tbody>
            {data.percentages.map(p => (
              <tr key={p.subject_id} style={{ borderBottom: '1px solid #333' }}>
                <td style={{ padding: '0.75rem' }}>{p.subject_name}</td>
                <td style={{ padding: '0.75rem', textAlign: 'center' }}>{p.total_classes}</td>
                <td style={{ padding: '0.75rem', textAlign: 'center' }}>{p.present_count}</td>
                <td style={{ padding: '0.75rem', textAlign: 'center', color: p.percentage >= 75 ? '#4f9' : '#f44' }}>
                  {p.percentage}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ color: '#aaa' }}>No attendance records found.</p>
      )}
    </div>
  );
}
