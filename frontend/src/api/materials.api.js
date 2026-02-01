import api from "./axios";

// Get all materials (with optional filters)
export const getMaterials = async (subjectId, type = null) => {
    const params = { subjectId };
    if (type) params.type = type;
    const response = await api.get("/materials", { params });
    return response.data;
};

// Upload material (faculty only)
export const uploadMaterial = async (formData) => {
    const response = await api.post("/materials/upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

// Get all subjects
export const getSubjects = async (semester = null) => {
    const params = semester ? { semester } : {};
    const response = await api.get("/subjects", { params });
    return response.data;
};

// Get subjects for current user (based on faculty assignment or student semester)
export const getMySubjects = async () => {
    const response = await api.get("/subjects/my");
    return response.data;
};
