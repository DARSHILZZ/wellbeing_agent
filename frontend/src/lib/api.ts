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

export const chatSocratic = async (query: string, studentId: string, chatHistory: any[] = []) => {
    const res = await api.post(`/chat/socratic`, { 
        query: query, 
        student_id: studentId,
        chat_history: chatHistory 
    });
    return res.data;
};

export const loginBackend = async (email: string, password: string) => {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    const res = await api.post('/auth/login', formData, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });
    return res.data;
};

