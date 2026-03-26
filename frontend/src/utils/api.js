import axios from 'axios';

// Get the base API URL from environment variables, or default to localhost
// For production, if the frontend is served by the backend, we can use a relative path '/api'
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

console.log("🚀 API Base URL configured as:", API_BASE_URL);

if (!import.meta.env.VITE_API_URL && window.location.hostname !== 'localhost') {
    console.warn("⚠️ Warning: VITE_API_URL is NOT set in production environment!");
}

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Helper to set authorization header
export const setAuthToken = (token) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
};

export default api;
