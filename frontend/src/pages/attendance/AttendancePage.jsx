import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getRole, hasRole } from "../../utils/auth";
import { getMySubjects } from "../../api/materials.api";
import {
    markAttendance,
    getStudentsForSubject,
    getAttendanceHistory,
    getMyAttendance,
    getSubjectAttendance
} from "../../api/attendance.api";
import "../../styles/Attendance.css";

const AttendancePage = () => {
    const navigate = useNavigate();
    const role = getRole();
    const isFaculty = hasRole(["faculty", "admin"]);

    return (
        <div className="attendance-page">
            <div className="attendance-header">
                <button className="back-btn" onClick={() => navigate("/dashboard")}>
                    ← Back to Dashboard
                </button>
                <h1>{isFaculty ? "Mark Attendance" : "My Attendance"}</h1>
            </div>

            {isFaculty ? <FacultyAttendance /> : <StudentAttendance />}
        </div>
    );
};

// Faculty View - Mark Attendance
const FacultyAttendance = () => {
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [students, setStudents] = useState([]);
    const [classDate, setClassDate] = useState(new Date().toISOString().split("T")[0]);
    const [topic, setTopic] = useState("");
    const [attendance, setAttendance] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });
    const [history, setHistory] = useState([]);
    const [showHistory, setShowHistory] = useState(false);

    useEffect(() => {
        fetchSubjects();
    }, []);

    useEffect(() => {
        if (selectedSubject) {
            fetchStudents();
            fetchHistory();
        }
    }, [selectedSubject]);

    const fetchSubjects = async () => {
        try {
            const data = await getMySubjects();
            setSubjects(data);
            if (data.length > 0) {
                setSelectedSubject(data[0]);
            }
        } catch (err) {
            console.error("Failed to fetch subjects:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchStudents = async () => {
        try {
            const data = await getStudentsForSubject(selectedSubject.id);
            setStudents(data);
            // Initialize all as present
            const initial = {};
            data.forEach(s => { initial[s.id] = "present"; });
            setAttendance(initial);
        } catch (err) {
            console.error("Failed to fetch students:", err);
        }
    };

    const fetchHistory = async () => {
        try {
            const data = await getAttendanceHistory(selectedSubject.id);
            setHistory(data);
        } catch (err) {
            console.error("Failed to fetch history:", err);
        }
    };

    const toggleAttendance = (studentId) => {
        setAttendance(prev => ({
            ...prev,
            [studentId]: prev[studentId] === "present" ? "absent" : "present"
        }));
    };

    const markAllPresent = () => {
        const all = {};
        students.forEach(s => { all[s.id] = "present"; });
        setAttendance(all);
    };

    const markAllAbsent = () => {
        const all = {};
        students.forEach(s => { all[s.id] = "absent"; });
        setAttendance(all);
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        setMessage({ type: "", text: "" });

        try {
            const records = Object.entries(attendance).map(([studentId, status]) => ({
                studentId: parseInt(studentId),
                status
            }));

            await markAttendance(selectedSubject.id, classDate, topic, records);
            setMessage({ type: "success", text: "Attendance marked successfully!" });
            setTopic("");
            fetchHistory();
        } catch (err) {
            setMessage({
                type: "error",
                text: err.response?.data?.message || "Failed to mark attendance"
            });
        } finally {
            setSubmitting(false);
        }
    };

    const presentCount = Object.values(attendance).filter(s => s === "present").length;
    const absentCount = students.length - presentCount;

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="faculty-attendance">
            {/* Subject Selection */}
            <div className="controls-bar">
                <div className="control-group">
                    <label>Subject:</label>
                    <select
                        value={selectedSubject?.id || ""}
                        onChange={(e) => {
                            const subject = subjects.find(s => s.id === parseInt(e.target.value));
                            setSelectedSubject(subject);
                        }}
                    >
                        {subjects.map(subject => (
                            <option key={subject.id} value={subject.id}>
                                {subject.name} ({subject.code})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="control-group">
                    <label>Date:</label>
                    <input
                        type="date"
                        value={classDate}
                        onChange={(e) => setClassDate(e.target.value)}
                    />
                </div>

                <div className="control-group">
                    <label>Topic (optional):</label>
                    <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="e.g., Arrays, Loops"
                    />
                </div>
            </div>

            {/* Message */}
            {message.text && (
                <div className={`message ${message.type}`}>
                    {message.text}
                </div>
            )}

            {/* Tabs */}
            <div className="tabs">
                <button
                    className={!showHistory ? "active" : ""}
                    onClick={() => setShowHistory(false)}
                >
                    Mark Attendance
                </button>
                <button
                    className={showHistory ? "active" : ""}
                    onClick={() => setShowHistory(true)}
                >
                    History ({history.length})
                </button>
            </div>

            {!showHistory ? (
                <>
                    {/* Quick Actions */}
                    <div className="quick-actions">
                        <button onClick={markAllPresent} className="action-btn">
                            ✓ Mark All Present
                        </button>
                        <button onClick={markAllAbsent} className="action-btn secondary">
                            ✗ Mark All Absent
                        </button>
                        <span className="summary">
                            Present: <strong>{presentCount}</strong> | Absent: <strong>{absentCount}</strong>
                        </span>
                    </div>

                    {/* Student List */}
                    <div className="student-list">
                        {students.length === 0 ? (
                            <div className="no-students">No students found for this subject</div>
                        ) : (
                            students.map(student => (
                                <div
                                    key={student.id}
                                    className={`student-row ${attendance[student.id]}`}
                                    onClick={() => toggleAttendance(student.id)}
                                >
                                    <div className="student-info">
                                        <span className="roll">{student.roll_number || "--"}</span>
                                        <span className="name">{student.name}</span>
                                    </div>
                                    <div className={`status-badge ${attendance[student.id]}`}>
                                        {attendance[student.id] === "present" ? "Present" : "Absent"}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Submit */}
                    {students.length > 0 && (
                        <button
                            className="submit-btn"
                            onClick={handleSubmit}
                            disabled={submitting}
                        >
                            {submitting ? "Submitting..." : "Submit Attendance"}
                        </button>
                    )}
                </>
            ) : (
                /* History View */
                <div className="history-list">
                    {history.length === 0 ? (
                        <div className="no-history">No attendance records yet</div>
                    ) : (
                        history.map(record => (
                            <div key={record.class_id} className="history-row">
                                <div className="date">{new Date(record.class_date).toLocaleDateString()}</div>
                                <div className="topic">{record.topic || "No topic"}</div>
                                <div className="stats">
                                    {record.present_count}/{record.total_students} present
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

// Student View - View Attendance
const StudentAttendance = () => {
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [details, setDetails] = useState([]);
    const [loadingDetails, setLoadingDetails] = useState(false);

    useEffect(() => {
        fetchAttendance();
    }, []);

    const fetchAttendance = async () => {
        try {
            const data = await getMyAttendance();
            setAttendance(data);
        } catch (err) {
            console.error("Failed to fetch attendance:", err);
        } finally {
            setLoading(false);
        }
    };

    const viewDetails = async (subject) => {
        setSelectedSubject(subject);
        setLoadingDetails(true);
        try {
            const data = await getSubjectAttendance(subject.subject_id);
            setDetails(data);
        } catch (err) {
            console.error("Failed to fetch details:", err);
        } finally {
            setLoadingDetails(false);
        }
    };

    const getPercentageColor = (percentage) => {
        if (percentage >= 75) return "good";
        if (percentage >= 60) return "warning";
        return "danger";
    };

    if (loading) {
        return <div className="loading">Loading attendance...</div>;
    }

    return (
        <div className="student-attendance">
            {!selectedSubject ? (
                <>
                    <p className="intro">Your attendance summary across all subjects:</p>

                    <div className="attendance-grid">
                        {attendance.length === 0 ? (
                            <div className="no-attendance">No attendance records found</div>
                        ) : (
                            attendance.map(subject => (
                                <div
                                    key={subject.subject_id}
                                    className="attendance-card"
                                    onClick={() => viewDetails(subject)}
                                >
                                    <div className="subject-name">{subject.subject}</div>
                                    <div className="subject-code">{subject.subject_code}</div>
                                    <div className={`percentage ${getPercentageColor(subject.percentage)}`}>
                                        {subject.percentage}%
                                    </div>
                                    <div className="breakdown">
                                        {subject.present_count} / {subject.total_classes} classes
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </>
            ) : (
                <>
                    <button
                        className="back-link"
                        onClick={() => setSelectedSubject(null)}
                    >
                        ← Back to Summary
                    </button>

                    <h2>{selectedSubject.subject}</h2>
                    <p className="subject-stats">
                        {selectedSubject.present_count} present out of {selectedSubject.total_classes} classes
                        ({selectedSubject.percentage}%)
                    </p>

                    {loadingDetails ? (
                        <div className="loading">Loading details...</div>
                    ) : (
                        <div className="details-list">
                            {details.map((record, idx) => (
                                <div key={idx} className={`detail-row ${record.status}`}>
                                    <div className="date">
                                        {new Date(record.class_date).toLocaleDateString()}
                                    </div>
                                    <div className="topic">{record.topic || "--"}</div>
                                    <div className={`status ${record.status}`}>
                                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default AttendancePage;
