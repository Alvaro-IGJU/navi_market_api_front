import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);

      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');

      if (accessToken) {
        try {
          await fetchUserInfo(accessToken);
        } catch {
          if (refreshToken) {
            await renewAccessToken(refreshToken);
          } else {
            handleLogout();
          }
        }
      }

      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const fetchUserInfo = async (token) => {
    const response = await api.get('/users/profile/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setUser(response.data);
    setIsAuthenticated(true);
  };

  const renewAccessToken = async (refreshToken) => {
    try{
      const response = await api.post('/token/refresh/', { refresh: refreshToken });
      const newAccessToken = response.data.access;
      localStorage.setItem('accessToken', newAccessToken);
      await fetchUserInfo(newAccessToken);

    }catch(error){
      handleLogout()
    }
  };

  const loginUser = async (tokens) => {
    try {
      localStorage.setItem('accessToken', tokens.access);
      localStorage.setItem('refreshToken', tokens.refresh);
      await fetchUserInfo(tokens.access);
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      handleLogout();
    }
  };

  const handleLogout = () => {
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
        isLoading,
        user,
        loginUser,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
