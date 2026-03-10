import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Attendance() {
  const { user } = useAuth();
  if (user?.role === 'faculty' || user?.role === 'admin') return <FacultyAttendance />;
  return <StudentAttendance />;
}

function FacultyAttendance() {
  const [form, setForm] = useState({ subject_id: '', date: '', records: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleMark = async (e) => {
    e.preventDefault();
    if (!form.subject_id || !form.date || !form.records) { setMessage('All fields required. Format: student_id:status,student_id:status'); return; }
    setLoading(true);
    try {
      const records = form.records.split(',').map(r => {
        const [student_id, status] = r.trim().split(':');
        return { student_id: parseInt(student_id), status: status || 'present' };
      });
      await api.post('/attendance/mark', { subject_id: parseInt(form.subject_id), date: form.date, records });
      setMessage('Attendance marked successfully!');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to mark attendance');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper" style={{ padding: '40px 48px', maxWidth: '640px', margin: '0 auto' }}>
      <div className="page-header">
        <h1 className="page-title">📋 Mark Attendance</h1>
        <Link to="/dashboard" className="back-link">← Dashboard</Link>
      </div>
      {message && <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'}`}>{message}</div>}
      <div className="card" style={{ padding: '32px' }}>
        <form onSubmit={handleMark}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-500)', marginBottom: '6px' }}>Subject ID *</label>
            <input className="input" value={form.subject_id} onChange={e => setForm(f => ({ ...f, subject_id: e.target.value }))} required />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-500)', marginBottom: '6px' }}>Date *</label>
            <input className="input" type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} required />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-500)', marginBottom: '6px' }}>Records * (id:status,id:status)</label>
            <input className="input" value={form.records} onChange={e => setForm(f => ({ ...f, records: e.target.value }))} placeholder="3:present,4:absent" required />
          </div>
          <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%' }}>{loading ? 'Marking...' : 'Mark Attendance'}</button>
        </form>
      </div>
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
    <div className="page-wrapper" style={{ padding: '40px 48px', maxWidth: '800px', margin: '0 auto' }}>
      <div className="page-header">
        <h1 className="page-title">📋 My Attendance</h1>
        <Link to="/dashboard" className="back-link">← Dashboard</Link>
      </div>

      {loading ? <p style={{ color: 'var(--text-500)' }}>Loading...</p> : data?.percentages?.length > 0 ? (
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-pale)' }}>
                <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '13px', fontWeight: 600, color: 'var(--text-500)' }}>Subject</th>
                <th style={{ padding: '14px 20px', textAlign: 'center', fontSize: '13px', fontWeight: 600, color: 'var(--text-500)' }}>Total</th>
                <th style={{ padding: '14px 20px', textAlign: 'center', fontSize: '13px', fontWeight: 600, color: 'var(--text-500)' }}>Present</th>
                <th style={{ padding: '14px 20px', textAlign: 'center', fontSize: '13px', fontWeight: 600, color: 'var(--text-500)' }}>%</th>
              </tr>
            </thead>
            <tbody>
              {data.percentages.map(p => (
                <tr key={p.subject_id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '14px 20px', fontWeight: 500, color: 'var(--text-900)' }}>{p.subject_name}</td>
                  <td style={{ padding: '14px 20px', textAlign: 'center', color: 'var(--text-700)' }}>{p.total_classes}</td>
                  <td style={{ padding: '14px 20px', textAlign: 'center', color: 'var(--text-700)' }}>{p.present_count}</td>
                  <td style={{ padding: '14px 20px', textAlign: 'center', fontWeight: 700, color: p.percentage >= 75 ? '#0d9654' : '#d93025' }}>{p.percentage}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '48px' }}>
          <p style={{ color: 'var(--text-500)' }}>No attendance records found.</p>
        </div>
      )}
    </div>
  );
}
