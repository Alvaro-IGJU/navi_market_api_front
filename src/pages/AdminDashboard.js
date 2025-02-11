import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AdminUsersTable from "../components/AdminUsersTable"; // Componente hijo
import { AuthContext } from "../contexts/AuthContext"; // Contexto de autenticación

const AdminDashboard = () => {
  const { user } = useContext(AuthContext); // Contexto para el usuario autenticado
  const navigate = useNavigate(); // Para redirigir si no es superusuario


  // Verificación de permisos del usuario
  useEffect(() => {
    if (!user?.is_superuser) {
      navigate("/"); // Redirigir si no es superusuario
    }
  }, [user, navigate]);

  return (
    <div>
      <h1 className="text-2xl font-bold mt-20">Dashboard de Admin</h1>

      <AdminUsersTable
      />
    </div>
  );
};

export default AdminDashboard;
