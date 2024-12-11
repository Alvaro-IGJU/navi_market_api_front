import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  
  // Si no está autenticado, redirige al formulario de inicio de sesión
  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }

  // Si está autenticado, renderiza la página protegida
  return children;
};

export default PrivateRoute;
