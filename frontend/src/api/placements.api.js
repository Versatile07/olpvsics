import api from "./axios";

// Get placements
export const getPlacements = async (type = null) => {
    const params = type ? { type } : {};
    const response = await api.get("/placements", { params });
    return response.data;
};

// Admin: Create placement
export const createPlacement = async (data) => {
    const response = await api.post("/placements", data);
    return response.data;
};

// Admin: Delete placement
export const deletePlacement = async (id) => {
    const response = await api.delete(`/placements/${id}`);
    return response.data;
};
