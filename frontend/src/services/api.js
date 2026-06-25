import axios from 'axios';
import toast from 'react-hot-toast';

const API = axios.create({ baseURL: 'http://localhost:5001/api' });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong';
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/' && window.location.pathname !== '/signup') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth
export const login = (data) => API.post('/auth/login', data);
export const register = (data) => API.post('/auth/register', data);
export const getUserProfile = () => API.get('/auth/profile');
export const updateProfile = (data) => API.put('/auth/profile', data);
export const changePassword = (data) => API.put('/auth/change-password', data);
export const forgotPassword = (data) => API.post('/auth/forgot-password', data);
export const resetPassword = (data) => API.post('/auth/reset-password', data);

// Trade
export const getHoldings = () => API.get('/trade/holdings');
export const getTransactions = () => API.get('/trade/transactions');
export const executeTrade = (data) => API.post('/trade/execute', data);
export const getLiveQuote = (symbol) => API.get(`/trade/quote/${symbol}`);

// Analytics
export const getAnalytics = () => API.get('/analytics/dashboard');
export const getUserStats = () => API.get('/analytics/stats');

// Watchlist
export const getWatchlist = () => API.get('/watchlist');
export const addToWatchlist = (symbol) => API.post('/watchlist/add', { symbol });
export const removeFromWatchlist = (symbol) => API.post('/watchlist/remove', { symbol });

// AI
export const getAiInsights = () => API.get('/ai/insights');

// Market
export const getTrendingStocks = () => API.get('/market/trending');
export const getTopMovers = () => API.get('/market/movers');
export const searchStock = (query) => API.get(`/market/search?q=${query}`);
export const getStockProfile = (symbol) => API.get(`/market/profile/${symbol}`);
export const getMarketNews = () => API.get('/market/news');

export default API;