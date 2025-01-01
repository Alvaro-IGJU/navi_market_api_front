import React from "react";
import { useNavigate } from "react-router-dom";
import "../adminMenu.css";

const AdminMenu = () => {
  const navigate = useNavigate();

  const adminOptions = [
    { name: "Dashboard", description: "Ver estadísticas generales", route: "/admin/dashboard" },
    { name: "Administrar eventos", description: "Añadir un nuevo evento", route: "/admin/events" },
    { name: "Administrar stands", description: "Crear un nuevo stand", route: "/admin/stands" },
    { name: "Administrar sectores", description: "Definir un nuevo sector", route: "/admin/sectors" },
    { name: "Administrar posiciones", description: "Asignar posiciones en un sector", route: "/admin/positions" },
    { name: "Crear Usuario Empresa", description: "Registrar un nuevo usuario de empresa", route: "/admin/create-company-user" },
  ];

  const handleNavigate = (route) => {
    navigate(route);
  };

  return (
    <div className="admin-page">
      <h1 className="text-3xl font-bold">Panel de Administración</h1>
      <p className="mt-2 text-gray-400">Selecciona una opción para gestionar los recursos</p>
      <div className="admin-options">
        {adminOptions.map((option, index) => (
          <div
            key={index}
            className="admin-option"
            onClick={() => handleNavigate(option.route)}
          >
            <h3>{option.name}</h3>
            <p>{option.description}</p>
            <a href="#">Ir</a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminMenu;
