import axios from 'axios';

// Base URL de la API
const api = axios.create({
  // baseURL: 'http://192.168.1.129:8000/api',
  baseURL: 'http://192.168.1.43:8000/api',
});

export default api;
