import React, { useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useContext(AuthContext);

  useEffect(() => {
    console.log('PrivateRoute: User:', user, 'isAuthenticated:', isAuthenticated, 'isLoading:', isLoading);
  }, [user, isAuthenticated, isLoading]);

  if (isLoading) {
    return <p>Cargando...</p>; // Mostrar mensaje de carga mientras se verifica la autenticación
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

export default PrivateRoute;
