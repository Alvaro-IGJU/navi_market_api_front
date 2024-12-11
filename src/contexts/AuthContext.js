import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem('accessToken')
  );
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (accessToken) {
      fetchUserInfo(accessToken).catch(() => {
        if (refreshToken) {
          renewAccessToken(refreshToken);
        } else {
          logout();
        }
      });
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const fetchUserInfo = async (token) => {
    try {
      const response = await api.get('/users/profile/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error al cargar la información del usuario:', error);
      throw error;
    }
  };

  const renewAccessToken = async (refreshToken) => {
    try {
      const response = await api.post('/token/refresh/', { refresh: refreshToken });
      const newAccessToken = response.data.access;
      localStorage.setItem('accessToken', newAccessToken);
      await fetchUserInfo(newAccessToken);
    } catch (error) {
      console.error('No se pudo renovar el token:', error);
      logout();
    }
  };

  const loginUser = async (tokens) => {
    try {
      localStorage.setItem('accessToken', tokens.access);
      localStorage.setItem('refreshToken', tokens.refresh);
      await fetchUserInfo(tokens.access);
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      logout();
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setIsAuthenticated(false);
    setUser(null);
    navigate('/auth');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        setUser, // Incluye setUser aquí
        loginUser,
        logout,
        renewAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
