import axios from 'axios';

// Determine API URL based on environment
const getApiUrl = () => {
    const isProduction = process.env.NODE_ENV === 'production';
    return isProduction ? 
        process.env.REACT_APP_API_PROD_URL : 
        process.env.REACT_APP_API_URL;
};

const api = axios.create({
    baseURL: `${getApiUrl()}/api`,
    headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request if present
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('ql_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export default api;
