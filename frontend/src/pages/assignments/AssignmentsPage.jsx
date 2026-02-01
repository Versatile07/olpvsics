import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getRole, hasRole } from "../../utils/auth";
import { getMySubjects } from "../../api/materials.api";
import { getAssignments, createAssignment, submitAssignment } from "../../api/assignments.api";
import "../../styles/Assignments.css";

const AssignmentsPage = () => {
    const navigate = useNavigate();
    const role = getRole();
    const isFaculty = hasRole(["faculty", "admin"]);

    const [assignments, setAssignments] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState("");
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [message, setMessage] = useState({ type: "", text: "" });

    // Form states
    const [createForm, setCreateForm] = useState({
        title: "", description: "", subjectId: "", deadline: "", maxMarks: 100, file: null
    });
    const [submitFile, setSubmitFile] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        fetchAssignments();
    }, [selectedSubject]);

    const fetchData = async () => {
        try {
            const subjectsData = await getMySubjects();
            setSubjects(subjectsData);
            if (subjectsData.length > 0) {
                setCreateForm(prev => ({ ...prev, subjectId: subjectsData[0].id }));
            }
            await fetchAssignments();
        } catch (err) {
            console.error("Failed to fetch data:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchAssignments = async () => {
        try {
            const data = await getAssignments(selectedSubject || null);
            setAssignments(data);
        } catch (err) {
            console.error("Failed to fetch assignments:", err);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage({ type: "", text: "" });

        try {
            const formData = new FormData();
            formData.append("title", createForm.title);
            formData.append("description", createForm.description);
            formData.append("subjectId", createForm.subjectId);
            formData.append("deadline", createForm.deadline);
            formData.append("maxMarks", createForm.maxMarks);
            if (createForm.file) formData.append("file", createForm.file);

            await createAssignment(formData);
            setMessage({ type: "success", text: "Assignment created successfully!" });
            setShowCreateModal(false);
            setCreateForm({ title: "", description: "", subjectId: subjects[0]?.id || "", deadline: "", maxMarks: 100, file: null });
            fetchAssignments();
        } catch (err) {
            setMessage({ type: "error", text: err.response?.data?.message || "Failed to create" });
        } finally {
            setSubmitting(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!submitFile) {
            setMessage({ type: "error", text: "Please select a file" });
            return;
        }

        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append("file", submitFile);
            await submitAssignment(selectedAssignment.id, formData);
            setMessage({ type: "success", text: "Assignment submitted successfully!" });
            setShowSubmitModal(false);
            setSubmitFile(null);
            fetchAssignments();
        } catch (err) {
            setMessage({ type: "error", text: err.response?.data?.message || "Submission failed" });
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString("en-IN", {
            day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
        });
    };

    const isOverdue = (deadline) => new Date(deadline) < new Date();

    const getStatusBadge = (assignment) => {
        if (isFaculty) {
            return <span className="badge info">{assignment.submission_count || 0} submissions</span>;
        }
        if (assignment.submission_id) {
            if (assignment.marks !== null) {
                return <span className="badge success">Graded: {assignment.marks}/{assignment.max_marks}</span>;
            }
            return <span className="badge success">Submitted</span>;
        }
        if (isOverdue(assignment.deadline)) {
            return <span className="badge danger">Overdue</span>;
        }
        return <span className="badge warning">Pending</span>;
    };

    if (loading) {
        return <div className="loading">Loading assignments...</div>;
    }

    return (
        <div className="assignments-page">
            <div className="page-header">
                <button className="back-btn" onClick={() => navigate("/dashboard")}>← Back</button>
                <h1>{isFaculty ? "Manage Assignments" : "My Assignments"}</h1>
                {isFaculty && (
                    <button className="create-btn" onClick={() => setShowCreateModal(true)}>
                        + Create Assignment
                    </button>
                )}
            </div>

            {message.text && <div className={`message ${message.type}`}>{message.text}</div>}

            {/* Filter */}
            <div className="filter-bar">
                <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
                    <option value="">All Subjects</option>
                    {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
            </div>

            {/* Assignments List */}
            <div className="assignments-list">
                {assignments.length === 0 ? (
                    <div className="no-data">No assignments found</div>
                ) : (
                    assignments.map(a => (
                        <div key={a.id} className={`assignment-card ${isOverdue(a.deadline) ? "overdue" : ""}`}>
                            <div className="assignment-header">
                                <h3>{a.title}</h3>
                                {getStatusBadge(a)}
                            </div>
                            <p className="subject">{a.subject_name} ({a.subject_code})</p>
                            {a.description && <p className="description">{a.description}</p>}
                            <div className="meta">
                                <span>Deadline: {formatDate(a.deadline)}</span>
                                <span>Max Marks: {a.max_marks}</span>
                                {!isFaculty && a.faculty_name && <span>By: {a.faculty_name}</span>}
                            </div>
                            <div className="actions">
                                {a.file_path && (
                                    <a href={`http://localhost:5000/${a.file_path}`} target="_blank" className="btn secondary">
                                        Download
                                    </a>
                                )}
                                {!isFaculty && !a.submission_id && !isOverdue(a.deadline) && (
                                    <button className="btn primary" onClick={() => { setSelectedAssignment(a); setShowSubmitModal(true); }}>
                                        Submit
                                    </button>
                                )}
                                {isFaculty && (
                                    <button className="btn secondary" onClick={() => navigate(`/assignments/${a.id}/submissions`)}>
                                        View Submissions
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Create Modal */}
            {showCreateModal && (
                <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Create Assignment</h2>
                            <button className="close-btn" onClick={() => setShowCreateModal(false)}>×</button>
                        </div>
                        <form onSubmit={handleCreate}>
                            <div className="form-group">
                                <label>Title *</label>
                                <input type="text" value={createForm.title} onChange={e => setCreateForm(p => ({ ...p, title: e.target.value }))} required />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea value={createForm.description} onChange={e => setCreateForm(p => ({ ...p, description: e.target.value }))} rows={3} />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Subject *</label>
                                    <select value={createForm.subjectId} onChange={e => setCreateForm(p => ({ ...p, subjectId: e.target.value }))} required>
                                        {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Max Marks</label>
                                    <input type="number" value={createForm.maxMarks} onChange={e => setCreateForm(p => ({ ...p, maxMarks: e.target.value }))} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Deadline *</label>
                                <input type="datetime-local" value={createForm.deadline} onChange={e => setCreateForm(p => ({ ...p, deadline: e.target.value }))} required />
                            </div>
                            <div className="form-group">
                                <label>Attachment (optional)</label>
                                <input type="file" onChange={e => setCreateForm(p => ({ ...p, file: e.target.files[0] }))} />
                            </div>
                            <div className="form-actions">
                                <button type="button" className="btn secondary" onClick={() => setShowCreateModal(false)}>Cancel</button>
                                <button type="submit" className="btn primary" disabled={submitting}>{submitting ? "Creating..." : "Create"}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Submit Modal */}
            {showSubmitModal && selectedAssignment && (
                <div className="modal-overlay" onClick={() => setShowSubmitModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Submit: {selectedAssignment.title}</h2>
                            <button className="close-btn" onClick={() => setShowSubmitModal(false)}>×</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Upload your work *</label>
                                <input type="file" onChange={e => setSubmitFile(e.target.files[0])} required />
                            </div>
                            <div className="form-actions">
                                <button type="button" className="btn secondary" onClick={() => setShowSubmitModal(false)}>Cancel</button>
                                <button type="submit" className="btn primary" disabled={submitting}>{submitting ? "Submitting..." : "Submit"}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AssignmentsPage;
