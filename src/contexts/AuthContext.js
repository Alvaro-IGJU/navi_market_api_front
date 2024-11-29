import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado de autenticación
  const [user, setUser] = useState(null); // Información del usuario
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setIsAuthenticated(true); // Cambia el estado a autenticado si hay token
      fetchUserInfo(token); // Carga la información del usuario
    }
  }, []);

  const fetchUserInfo = async (token) => {
    try {
      const response = await fetch('/users/me/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error('Error al cargar la información del usuario:', error);
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
        setIsAuthenticated, // Pasar la función al contexto
        user,
        setUser, // También pasar la función para actualizar el usuario
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
