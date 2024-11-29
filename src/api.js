import axios from 'axios';

// Base URL de la API
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});

export default api;
