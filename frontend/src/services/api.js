import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const login = (data) => API.post('/auth/login', data);
export const register = (data) => API.post('/auth/register', data);
export const getHoldings = () => API.get('/trade/holdings');
export const getTransactions = () => API.get('/trade/transactions');
export const executeTrade = (data) => API.post('/trade/execute', data);
export const getAnalytics = () => API.get('/analytics/dashboard');
export const getLiveQuote = (symbol) => API.get(`/trade/quote/${symbol}`);
export const getWatchlist = () => API.get('/watchlist');
export const addToWatchlist = (symbol) => API.post('/watchlist/add', { symbol });
export const removeFromWatchlist = (symbol) => API.post('/watchlist/remove', { symbol });
export const getAiInsights = () => API.get('/ai/insights');