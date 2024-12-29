import axios from 'axios';

// Base URL de la API
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});

export default api;
// baseURL: 'http://18.184.173.4:80/api',
