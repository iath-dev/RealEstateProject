import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error('VITE_API_BASE_URL not defined in .env');
}

const api = axios.create({
  baseURL: API_BASE_URL,
});

export default api;
