import api from "./axios";

// Get assignments (role-based)
export const getAssignments = async (subjectId = null) => {
    const params = subjectId ? { subjectId } : {};
    const response = await api.get("/assignments", { params });
    return response.data;
};

// Faculty: Create assignment
export const createAssignment = async (formData) => {
    const response = await api.post("/assignments", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
};

// Student: Submit assignment
export const submitAssignment = async (assignmentId, formData) => {
    const response = await api.post(`/assignments/${assignmentId}/submit`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
};

// Faculty: Get submissions
export const getSubmissions = async (assignmentId) => {
    const response = await api.get(`/assignments/${assignmentId}/submissions`);
    return response.data;
};

// Faculty: Grade submission
export const gradeSubmission = async (submissionId, marks, remarks) => {
    const response = await api.patch(`/assignments/submissions/${submissionId}/grade`, {
        marks,
        remarks,
    });
    return response.data;
};
