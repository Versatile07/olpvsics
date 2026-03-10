import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function ExternalCourses() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      const res = await api.get('/external-courses');
      setCourses(res.data);
    } catch (err) {
      console.error('Failed to fetch courses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCourses(); }, []);

  const handleEnroll = async (courseId) => {
    try {
      await api.post(`/external-courses/${courseId}/enroll`);
      alert('Enrolled successfully!');
      fetchCourses();
    } catch (err) {
      alert(err.response?.data?.message || 'Enrollment failed');
    }
  };

  const handleCertUpload = async (courseId, file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      await api.post(`/external-courses/${courseId}/upload-certificate`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      alert('Certificate uploaded!');
      fetchCourses();
    } catch (err) {
      alert(err.response?.data?.message || 'Upload failed');
    }
  };

  return (
    <div className="page-wrapper" style={{ padding: '40px 48px', maxWidth: '900px', margin: '0 auto' }}>
      <div className="page-header">
        <h1 className="page-title">🌐 External Courses</h1>
        <Link to="/dashboard" className="back-link">← Dashboard</Link>
      </div>

      {loading ? <p style={{ color: 'var(--text-500)' }}>Loading...</p> : courses.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px' }}>
          <p style={{ color: 'var(--text-500)' }}>No external courses available.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {courses.map(c => (
            <div key={c.id} className="card" style={{ padding: '20px 24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--text-900)', margin: '0 0 2px 0' }}>{c.title}</h3>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--brand-blue-500)', margin: '0 0 6px 0' }}>Provider: {c.provider || 'N/A'}</p>
                  {c.description && <p style={{ fontSize: '14px', color: 'var(--text-700)', margin: '0 0 8px 0', lineHeight: 1.5 }}>{c.description}</p>}
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                    {c.link && <a href={c.link} target="_blank" rel="noreferrer" className="btn-secondary" style={{ fontSize: '13px', height: '32px', padding: '4px 12px' }}>🔗 Course Link</a>}
                    {c.deadline && <span style={{ fontSize: '12px', color: 'var(--text-300)' }}>Deadline: {new Date(c.deadline).toLocaleDateString()}</span>}
                  </div>
                </div>
              </div>

              {user?.role === 'student' && (
                <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <button onClick={() => handleEnroll(c.id)} className="btn-primary" style={{ height: '36px', fontSize: '13px', padding: '6px 16px' }}>Enroll</button>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input type="file" onChange={e => handleCertUpload(c.id, e.target.files[0])} style={{ fontSize: '12px', color: 'var(--text-700)' }} />
                    <span style={{ fontSize: '11px', color: 'var(--text-300)' }}>Upload certificate</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
