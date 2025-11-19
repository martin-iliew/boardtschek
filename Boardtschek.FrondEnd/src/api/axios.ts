import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5050/";

const apiClient = axios.create({
    baseURL: apiBaseUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use((config) => {
    const newLocal = localStorage.getItem('token');
    const token = newLocal;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        console.log("Full error", error);
        console.error('Axios Response Error:', error.response); 
        if (error.response?.status === 401) {
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default apiClient;
