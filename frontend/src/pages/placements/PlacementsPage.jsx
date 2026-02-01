import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { hasRole } from "../../utils/auth";
import { getPlacements, createPlacement, deletePlacement } from "../../api/placements.api";
import "../../styles/Placements.css";

const PlacementsPage = () => {
    const navigate = useNavigate();
    const isAdmin = hasRole(["admin"]);

    const [placements, setPlacements] = useState([]);
    const [filter, setFilter] = useState("");
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });
    const [submitting, setSubmitting] = useState(false);

    const [form, setForm] = useState({
        title: "", company: "", type: "job", description: "",
        eligibility: "", location: "", salaryPackage: "", applyLink: "", deadline: ""
    });

    useEffect(() => {
        fetchPlacements();
    }, [filter]);

    const fetchPlacements = async () => {
        try {
            const data = await getPlacements(filter || null);
            setPlacements(data);
        } catch (err) {
            console.error("Failed to fetch placements:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await createPlacement(form);
            setMessage({ type: "success", text: "Placement posted successfully!" });
            setShowModal(false);
            setForm({ title: "", company: "", type: "job", description: "", eligibility: "", location: "", salaryPackage: "", applyLink: "", deadline: "" });
            fetchPlacements();
        } catch (err) {
            setMessage({ type: "error", text: err.response?.data?.message || "Failed to post" });
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this placement?")) return;
        try {
            await deletePlacement(id);
            fetchPlacements();
        } catch (err) {
            console.error("Delete failed:", err);
        }
    };

    const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    const isExpired = (deadline) => new Date(deadline) < new Date();

    const typeColors = { job: "primary", internship: "secondary", workshop: "warning" };

    if (loading) return <div className="loading">Loading placements...</div>;

    return (
        <div className="placements-page">
            <div className="page-header">
                <button className="back-btn" onClick={() => navigate("/dashboard")}>← Back</button>
                <h1>Placements & Opportunities</h1>
                {isAdmin && <button className="create-btn" onClick={() => setShowModal(true)}>+ Post Opportunity</button>}
            </div>

            {message.text && <div className={`message ${message.type}`}>{message.text}</div>}

            <div className="filter-bar">
                <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                    <option value="">All Types</option>
                    <option value="job">Jobs</option>
                    <option value="internship">Internships</option>
                    <option value="workshop">Workshops</option>
                </select>
            </div>

            <div className="placements-grid">
                {placements.length === 0 ? (
                    <div className="no-data">No opportunities found</div>
                ) : (
                    placements.map(p => (
                        <div key={p.id} className={`placement-card ${isExpired(p.deadline) ? "expired" : ""}`}>
                            <div className="card-header">
                                <span className={`type-badge ${typeColors[p.type]}`}>{p.type}</span>
                                {isAdmin && <button className="delete-btn" onClick={() => handleDelete(p.id)}>×</button>}
                            </div>
                            <h3>{p.title}</h3>
                            <p className="company">{p.company}</p>
                            <p className="description">{p.description}</p>
                            <div className="details">
                                {p.location && <span>📍 {p.location}</span>}
                                {p.salary_package && <span>💰 {p.salary_package}</span>}
                            </div>
                            {p.eligibility && <p className="eligibility"><strong>Eligibility:</strong> {p.eligibility}</p>}
                            <div className="card-footer">
                                <span className="deadline">{isExpired(p.deadline) ? "Expired" : `Apply by ${formatDate(p.deadline)}`}</span>
                                {p.apply_link && !isExpired(p.deadline) && (
                                    <a href={p.apply_link} target="_blank" className="apply-btn">Apply Now</a>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Post New Opportunity</h2>
                            <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
                        </div>
                        <form onSubmit={handleCreate}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Title *</label>
                                    <input type="text" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required />
                                </div>
                                <div className="form-group">
                                    <label>Company *</label>
                                    <input type="text" value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} required />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Type *</label>
                                    <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
                                        <option value="job">Job</option>
                                        <option value="internship">Internship</option>
                                        <option value="workshop">Workshop</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Deadline *</label>
                                    <input type="date" value={form.deadline} onChange={e => setForm(p => ({ ...p, deadline: e.target.value }))} required />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Description *</label>
                                <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3} required />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Location</label>
                                    <input type="text" value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} />
                                </div>
                                <div className="form-group">
                                    <label>Salary Package</label>
                                    <input type="text" value={form.salaryPackage} onChange={e => setForm(p => ({ ...p, salaryPackage: e.target.value }))} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Eligibility</label>
                                <input type="text" value={form.eligibility} onChange={e => setForm(p => ({ ...p, eligibility: e.target.value }))} />
                            </div>
                            <div className="form-group">
                                <label>Apply Link</label>
                                <input type="url" value={form.applyLink} onChange={e => setForm(p => ({ ...p, applyLink: e.target.value }))} />
                            </div>
                            <div className="form-actions">
                                <button type="button" className="btn secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn primary" disabled={submitting}>{submitting ? "Posting..." : "Post"}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlacementsPage;
