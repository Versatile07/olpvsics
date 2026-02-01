import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMySubjects } from "../../api/materials.api";
import { getMaterials, uploadMaterial } from "../../api/materials.api";
import { getRole, hasRole } from "../../utils/auth";
import "../../styles/Notes.css";

const NotesPage = () => {
    const navigate = useNavigate();
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [filterType, setFilterType] = useState("all"); // 'all', 'notes', 'paper'
    const [message, setMessage] = useState({ type: "", text: "" });

    const canUpload = hasRole(["faculty", "admin"]);
    const userRole = getRole();

    // Form state for upload
    const [uploadForm, setUploadForm] = useState({
        title: "",
        description: "",
        type: "notes",
        subjectId: "",
        year: "",
        file: null,
    });

    useEffect(() => {
        fetchSubjects();
    }, []);

    useEffect(() => {
        if (selectedSubject) {
            fetchMaterials();
        }
    }, [selectedSubject, filterType]);

    const fetchSubjects = async () => {
        try {
            const data = await getMySubjects();
            setSubjects(data);
            if (data.length > 0) {
                setSelectedSubject(data[0]);
                setUploadForm(prev => ({ ...prev, subjectId: data[0].id }));
            }
        } catch (err) {
            console.error("Failed to fetch subjects:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchMaterials = async () => {
        try {
            const type = filterType === "all" ? null : filterType;
            const data = await getMaterials(selectedSubject.id, type);
            setMaterials(data);
        } catch (err) {
            console.error("Failed to fetch materials:", err);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!uploadForm.file) {
            setMessage({ type: "error", text: "Please select a file" });
            return;
        }

        setUploading(true);
        setMessage({ type: "", text: "" });

        try {
            const formData = new FormData();
            formData.append("title", uploadForm.title);
            formData.append("description", uploadForm.description);
            formData.append("type", uploadForm.type);
            formData.append("subjectId", uploadForm.subjectId);
            if (uploadForm.type === "paper" && uploadForm.year) {
                formData.append("year", uploadForm.year);
            }
            formData.append("file", uploadForm.file);

            await uploadMaterial(formData);
            setMessage({ type: "success", text: "Material uploaded successfully!" });
            setShowUploadModal(false);
            setUploadForm({
                title: "",
                description: "",
                type: "notes",
                subjectId: selectedSubject?.id || "",
                year: "",
                file: null,
            });
            fetchMaterials();
        } catch (err) {
            setMessage({ type: "error", text: err.response?.data?.message || "Upload failed" });
        } finally {
            setUploading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setUploadForm(prev => ({ ...prev, file }));
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    const getFileIcon = (type) => {
        return type === "paper" ? "📄" : "📚";
    };

    if (loading) {
        return (
            <div className="notes-loading">
                <div className="spinner"></div>
                <p>Loading materials...</p>
            </div>
        );
    }

    return (
        <div className="notes-page">
            {/* Header */}
            <div className="notes-header">
                <button className="back-btn" onClick={() => navigate("/dashboard")}>
                    ← Back to Dashboard
                </button>
                <h1>Study Materials</h1>
                {canUpload && (
                    <button className="upload-btn" onClick={() => setShowUploadModal(true)}>
                        + Upload Material
                    </button>
                )}
            </div>

            {/* Message */}
            {message.text && (
                <div className={`message ${message.type}`}>
                    {message.text}
                </div>
            )}

            {/* Filters */}
            <div className="notes-filters">
                <div className="subject-selector">
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

                <div className="type-filter">
                    <button
                        className={filterType === "all" ? "active" : ""}
                        onClick={() => setFilterType("all")}
                    >
                        All
                    </button>
                    <button
                        className={filterType === "notes" ? "active" : ""}
                        onClick={() => setFilterType("notes")}
                    >
                        Notes
                    </button>
                    <button
                        className={filterType === "paper" ? "active" : ""}
                        onClick={() => setFilterType("paper")}
                    >
                        Papers
                    </button>
                </div>
            </div>

            {/* Materials List */}
            <div className="materials-grid">
                {materials.length === 0 ? (
                    <div className="no-materials">
                        <p>No materials found for this subject.</p>
                        {canUpload && <p>Click "Upload Material" to add study materials.</p>}
                    </div>
                ) : (
                    materials.map(material => (
                        <div key={material.id} className={`material-card ${material.type}`}>
                            <div className="material-icon">{getFileIcon(material.type)}</div>
                            <div className="material-info">
                                <h3>{material.title}</h3>
                                {material.description && <p className="description">{material.description}</p>}
                                <div className="meta">
                                    <span className="type-badge">{material.type}</span>
                                    {material.year && <span className="year">Year: {material.year}</span>}
                                    <span className="date">{formatDate(material.uploaded_at)}</span>
                                </div>
                                <p className="uploaded-by">By: {material.uploaded_by}</p>
                            </div>
                            <a
                                href={`http://localhost:5000/${material.file_path}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="download-btn"
                            >
                                Download
                            </a>
                        </div>
                    ))
                )}
            </div>

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="modal-overlay" onClick={() => setShowUploadModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Upload Material</h2>
                            <button className="close-btn" onClick={() => setShowUploadModal(false)}>×</button>
                        </div>
                        <form onSubmit={handleUpload} className="upload-form">
                            <div className="form-group">
                                <label>Title *</label>
                                <input
                                    type="text"
                                    value={uploadForm.title}
                                    onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                                    required
                                    placeholder="Enter material title"
                                />
                            </div>

                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    value={uploadForm.description}
                                    onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="Brief description (optional)"
                                    rows={3}
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Type *</label>
                                    <select
                                        value={uploadForm.type}
                                        onChange={(e) => setUploadForm(prev => ({ ...prev, type: e.target.value }))}
                                    >
                                        <option value="notes">Notes</option>
                                        <option value="paper">Previous Year Paper</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Subject *</label>
                                    <select
                                        value={uploadForm.subjectId}
                                        onChange={(e) => setUploadForm(prev => ({ ...prev, subjectId: e.target.value }))}
                                        required
                                    >
                                        {subjects.map(subject => (
                                            <option key={subject.id} value={subject.id}>
                                                {subject.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {uploadForm.type === "paper" && (
                                <div className="form-group">
                                    <label>Year</label>
                                    <input
                                        type="number"
                                        value={uploadForm.year}
                                        onChange={(e) => setUploadForm(prev => ({ ...prev, year: e.target.value }))}
                                        placeholder="e.g., 2024"
                                        min="2000"
                                        max="2030"
                                    />
                                </div>
                            )}

                            <div className="form-group">
                                <label>File *</label>
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    accept=".pdf,.doc,.docx,.ppt,.pptx,.zip"
                                    required
                                />
                                <p className="file-hint">Accepted: PDF, DOC, DOCX, PPT, PPTX, ZIP</p>
                            </div>

                            <div className="form-actions">
                                <button type="button" className="cancel-btn" onClick={() => setShowUploadModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="submit-btn" disabled={uploading}>
                                    {uploading ? "Uploading..." : "Upload"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotesPage;
