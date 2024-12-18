import React, { useEffect, useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom"; // Para redirección
import Header from "../components/Header";
import EventInteractionsChart from "../components/EventInteractionsChart";
import EventVisitsChart from "../components/EventVisitsChart"; // Nuevo componente
import api from "../api";
import { AuthContext } from "../contexts/AuthContext"; // Contexto de autenticación

const Dashboard = () => {
  const { user } = useContext(AuthContext); // Obtener usuario desde el contexto
  const navigate = useNavigate(); // Redirección
  const [totalTime, setTotalTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const hasFetched = useRef(false); // Controlar llamadas duplicadas
  const companyId = user?.company_relation;

  // Verificar si el usuario tiene el rol adecuado
  useEffect(() => {
    if (user?.role !== "Company") {
      navigate("/"); // Redirigir a la página de inicio u otra página
    }
  }, [user, navigate]);

  useEffect(() => {
    if (companyId && !hasFetched.current) {
      const fetchData = async () => {
        try {
          const token = localStorage.getItem("accessToken");
          console.log("Se ejecuta");
          const response = await api.get(`/interactions/companies/${companyId}/interactions/`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          const totalDuration = response.data.interaction_details.reduce(
            (sum, item) => sum + item.total_duration,
            0
          );
          setTotalTime(totalDuration);
          setLoading(false);
        } catch (err) {
          console.error("Error al obtener los datos:", err);
          setError("No se pudieron cargar las estadísticas.");
          setLoading(false);
        }
      };

      fetchData();
      hasFetched.current = true; // Evita múltiples llamadas
    }
  }, [companyId]);

  if (loading) return <p className="text-gray-300">Cargando datos...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <>
      <Header />
      <div className="container mt-4 text-white">
        <h1 className="text-2xl font-bold mb-4">Dashboard de Interacciones</h1>

        {/* Gráfico de Líneas - Evolución de Visitas */}
        <EventVisitsChart companyId={companyId} />

        {/* Tiempo total destacado */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6 text-center">
          <h2 className="text-xl font-semibold text-[#C7AA68] mb-4">Tiempo Total en el Stand</h2>
          <p className="text-3xl font-bold">
            {Math.floor(totalTime / 60)} minutos {totalTime % 60} segundos
          </p>
        </div>

        {/* Gráfico General */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-xl font-semibold mb-4 text-[#C7AA68]">Interacciones Generales</h2>
          <EventInteractionsChart companyId={companyId} />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
