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
      await api.post(`/external-courses/${courseId}/upload-certificate`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Certificate uploaded!');
      fetchCourses();
    } catch (err) {
      alert(err.response?.data?.message || 'Upload failed');
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h1>🌐 External Courses</h1>
        <Link to="/dashboard" style={{ color: '#aaa' }}>← Dashboard</Link>
      </div>

      {loading ? <p>Loading...</p> : courses.length === 0 ? (
        <p style={{ color: '#aaa' }}>No external courses available.</p>
      ) : (
        courses.map(c => (
          <div key={c.id} style={{ padding: '1rem', marginBottom: '0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <h3 style={{ margin: 0 }}>{c.title}</h3>
            <p style={{ color: '#4cf', margin: '0.25rem 0' }}>Provider: {c.provider || 'N/A'}</p>
            {c.description && <p style={{ color: '#ccc', fontSize: '0.9rem' }}>{c.description}</p>}
            {c.link && <a href={c.link} target="_blank" rel="noreferrer" style={{ color: '#4cf' }}>🔗 Course Link</a>}
            <p style={{ color: '#aaa', fontSize: '0.8rem' }}>
              Deadline: {c.deadline ? new Date(c.deadline).toLocaleDateString() : 'N/A'}
            </p>

            {user?.role === 'student' && (
              <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <button onClick={() => handleEnroll(c.id)} style={{ padding: '0.3rem 1rem', background: '#4f9', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                  Enroll
                </button>
                <input
                  type="file"
                  onChange={e => handleCertUpload(c.id, e.target.files[0])}
                  style={{ color: '#fff', fontSize: '0.85rem' }}
                />
                <span style={{ color: '#888', fontSize: '0.8rem' }}>Upload certificate after completion</span>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
