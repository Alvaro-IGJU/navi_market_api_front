import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom"; // Para redirección
import Header from "../components/Header";
import AdminEventVisitsChart from "../components/AdminEventVisitsChart"; // Nuevo componente
import api from "../api";
import { AuthContext } from "../contexts/AuthContext"; // Contexto de autenticación

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [eventsData, setEventsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Verificar si el usuario tiene permisos de administrador
  useEffect(() => {
    if (!user?.is_superuser) {
      navigate("/"); // Redirigir si no es superusuario
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchEventsData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        
        // Asegúrate de que la URL sea correcta, puedes revisar la documentación de la API
        const response = await api.get("/interactions/admin/events-visits-summary/", { // Verifica que este endpoint sea correcto
          headers: { Authorization: `Bearer ${token}` },
        });

        // Suponiendo que los datos del backend vienen en el formato { events: [ ... ] }
        setEventsData(response.data); // Almacenar los datos de los eventos
        setLoading(false);
      } catch (err) {
        console.error("Error al obtener los datos de eventos:", err);
        setError("No se pudieron cargar los eventos.");
        setLoading(false);
      }
    };

    fetchEventsData();
  }, []);

  if (loading) return <p className="text-gray-300">Cargando datos...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <Header />
      <h1 className="text-2xl font-bold mb-4">Dashboard de Admin</h1>

      {/* Gráfico de visitas a eventos */}
      <AdminEventVisitsChart eventsData={eventsData} />
    </div>
  );
};

export default AdminDashboard;
