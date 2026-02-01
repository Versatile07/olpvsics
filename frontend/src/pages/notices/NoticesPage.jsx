import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { hasRole, getRole } from "../../utils/auth";
import { getNotices, createNotice, deleteNotice } from "../../api/notices.api";
import "../../styles/Notices.css";

const NoticesPage = () => {
    const navigate = useNavigate();
    const canPost = hasRole(["admin", "faculty"]);
    const isAdmin = hasRole(["admin"]);

    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });
    const [submitting, setSubmitting] = useState(false);

    const [form, setForm] = useState({
        title: "", content: "", priority: "normal", targetRole: "all", expiresAt: "", attachment: null
    });

    useEffect(() => {
        fetchNotices();
    }, []);

    const fetchNotices = async () => {
        try {
            const data = await getNotices();
            setNotices(data);
        } catch (err) {
            console.error("Failed to fetch notices:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append("title", form.title);
            formData.append("content", form.content);
            formData.append("priority", form.priority);
            formData.append("targetRole", form.targetRole);
            if (form.expiresAt) formData.append("expiresAt", form.expiresAt);
            if (form.attachment) formData.append("attachment", form.attachment);

            await createNotice(formData);
            setMessage({ type: "success", text: "Notice posted successfully!" });
            setShowModal(false);
            setForm({ title: "", content: "", priority: "normal", targetRole: "all", expiresAt: "", attachment: null });
            fetchNotices();
        } catch (err) {
            setMessage({ type: "error", text: err.response?.data?.message || "Failed to post" });
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this notice?")) return;
        try {
            await deleteNotice(id);
            fetchNotices();
        } catch (err) {
            console.error("Delete failed:", err);
        }
    };

    const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

    const priorityColors = { urgent: "danger", important: "warning", normal: "default" };

    if (loading) return <div className="loading">Loading notices...</div>;

    return (
        <div className="notices-page">
            <div className="page-header">
                <button className="back-btn" onClick={() => navigate("/dashboard")}>← Back</button>
                <h1>Notice Board</h1>
                {canPost && <button className="create-btn" onClick={() => setShowModal(true)}>+ Post Notice</button>}
            </div>

            {message.text && <div className={`message ${message.type}`}>{message.text}</div>}

            <div className="notices-list">
                {notices.length === 0 ? (
                    <div className="no-data">No notices to display</div>
                ) : (
                    notices.map(n => (
                        <div key={n.id} className={`notice-card ${n.priority}`}>
                            <div className="notice-header">
                                {n.priority !== "normal" && (
                                    <span className={`priority-badge ${priorityColors[n.priority]}`}>
                                        {n.priority === "urgent" ? "🔴" : "🟡"} {n.priority.toUpperCase()}
                                    </span>
                                )}
                                {isAdmin && <button className="delete-btn" onClick={() => handleDelete(n.id)}>×</button>}
                            </div>
                            <h3>{n.title}</h3>
                            <p className="content">{n.content}</p>
                            {n.attachment_path && (
                                <a href={`http://localhost:5000/${n.attachment_path}`} target="_blank" className="attachment-link">
                                    📎 Attachment
                                </a>
                            )}
                            <div className="notice-meta">
                                <span>Posted by {n.posted_by_name}</span>
                                <span>{formatDate(n.created_at)}</span>
                                {n.target_role !== "all" && <span className="target">For: {n.target_role}s</span>}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Post New Notice</h2>
                            <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
                        </div>
                        <form onSubmit={handleCreate}>
                            <div className="form-group">
                                <label>Title *</label>
                                <input type="text" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required />
                            </div>
                            <div className="form-group">
                                <label>Content *</label>
                                <textarea value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} rows={4} required />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Priority</label>
                                    <select value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value }))}>
                                        <option value="normal">Normal</option>
                                        <option value="important">Important</option>
                                        <option value="urgent">Urgent</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Target Audience</label>
                                    <select value={form.targetRole} onChange={e => setForm(p => ({ ...p, targetRole: e.target.value }))}>
                                        <option value="all">Everyone</option>
                                        <option value="student">Students Only</option>
                                        <option value="faculty">Faculty Only</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Expires On (optional)</label>
                                <input type="date" value={form.expiresAt} onChange={e => setForm(p => ({ ...p, expiresAt: e.target.value }))} />
                            </div>
                            <div className="form-group">
                                <label>Attachment (optional)</label>
                                <input type="file" onChange={e => setForm(p => ({ ...p, attachment: e.target.files[0] }))} />
                            </div>
                            <div className="form-actions">
                                <button type="button" className="btn secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn primary" disabled={submitting}>{submitting ? "Posting..." : "Post Notice"}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NoticesPage;
