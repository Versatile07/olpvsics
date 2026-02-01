import api from "./axios";

// Get notices
export const getNotices = async () => {
    const response = await api.get("/notices");
    return response.data;
};

// Admin/Faculty: Create notice
export const createNotice = async (formData) => {
    const response = await api.post("/notices", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
};

// Admin: Delete notice
export const deleteNotice = async (id) => {
    const response = await api.delete(`/notices/${id}`);
    return response.data;
};
