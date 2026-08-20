import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const api = axios.create({
    baseURL: API_BASE,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const fetchStudentStats = async (sessionId: string) => {
    const res = await api.get(`/student/stats?session_id=${sessionId}`);
    return res.data;
};

export const fetchAdaptivePractice = async (sessionId: string) => {
    const res = await api.get(`/practice/adaptive?session_id=${sessionId}`);
    return res.data;
};

export const chatSocratic = async (message: string, sessionId: string) => {
    const res = await api.post(`/chat/socratic`, { message, session_id: sessionId });
    return res.data;
};
