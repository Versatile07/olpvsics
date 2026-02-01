import api from "./axios";

// Faculty: Mark attendance
export const markAttendance = async (subjectId, classDate, topic, records) => {
    const response = await api.post("/attendance/mark", {
        subjectId,
        classDate,
        topic,
        records, // Array of { studentId, status: 'present'|'absent'|'late' }
    });
    return response.data;
};

// Faculty: Get students for marking attendance
export const getStudentsForSubject = async (subjectId) => {
    const response = await api.get(`/attendance/students/${subjectId}`);
    return response.data;
};

// Faculty: Get attendance history
export const getAttendanceHistory = async (subjectId) => {
    const response = await api.get(`/attendance/history/${subjectId}`);
    return response.data;
};

// Student: Get attendance summary (with percentages)
export const getMyAttendance = async () => {
    const response = await api.get("/attendance/me");
    return response.data;
};

// Student: Get detailed attendance for a subject
export const getSubjectAttendance = async (subjectId) => {
    const response = await api.get(`/attendance/me/${subjectId}`);
    return response.data;
};
