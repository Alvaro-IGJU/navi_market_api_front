import React, { useEffect, useState } from "react";
import api from "../api";

const CompanyEventBasicStatistics = ({ companyId }) => {
  const [totalVisits, setTotalVisits] = useState(0);
  const [averageTimePerStand, setAverageTimePerStand] = useState(0);
  const [uniqueUsers, setUniqueUsers] = useState(0); // Para usuarios únicos
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        // Llamada para obtener visitas totales
        const visitsResponse = await api.get(`/interactions/companies/${companyId}/events-visits/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const events = visitsResponse.data.events;

        let totalVisits = 0;

        events.forEach((event) => {
          event.visits.forEach((visit) => {
            totalVisits += visit.total_visits;
          });
        });

        setTotalVisits(totalVisits);

        // Llamada para obtener estadísticas de interacciones
        const interactionsResponse = await api.get(
          `/interactions/companies/${companyId}/interactions/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const { stands_details, total_interactions, unique_users } = interactionsResponse.data;

        let totalAverageDuration = 0;
        let standEntryCount = 0;

        // Filtrar interacciones de tipo 'stand_entry' y sumar sus 'average_duration'
        stands_details.forEach((stand) => {
          stand.interaction_details
            .filter((interaction) => interaction.interaction_type === "stand_entry")
            .forEach((interaction) => {
              totalAverageDuration += interaction.average_duration;
              standEntryCount += 1;
            });
        });

        const averageTime = standEntryCount > 0 ? totalAverageDuration / standEntryCount : 0;
        setAverageTimePerStand(averageTime);
        setUniqueUsers(unique_users);
        setLoading(false);
      } catch (err) {
        console.error("Error al obtener las estadísticas:", err);
        setError("No se pudieron cargar las estadísticas.");
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [companyId]);

  if (loading) return <p className="text-gray-300">Cargando estadísticas...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-[#C7AA68] mb-4">Estadísticas de Visitas</h2>
      <div className="grid gap-4 grid-rows-2 grid-cols-2">
        {/* Fila 1: Total de Visitas */}
        <div className="row-span-1 col-span-2 bg-gray-900 p-6 rounded-lg shadow">
          <p className="text-3xl font-bold text-white text-center">Visitas totales al evento:</p>
          <p className="text-5xl font-bold text-white text-center">{totalVisits}</p>
        </div>
        {/* Fila 2: Tiempo promedio en stand */}
        <div className="col-span-1 bg-gray-900 p-6 rounded-lg shadow">
          <p className="text-lg text-white text-center">Tiempo Promedio en Stand:</p>
          <p className="text-xl font-bold text-white text-center">
            {Math.floor(averageTimePerStand / 60)} minutos{" "}
            {Math.floor(averageTimePerStand % 60)} segundos
          </p>
        </div>
        {/* Fila 2: Usuarios únicos */}
        <div className="col-span-1 bg-gray-900 p-6 rounded-lg shadow">
          <p className="text-lg text-white text-center">Usuarios Únicos:</p>
          <p className="text-xl font-bold text-white text-center">{uniqueUsers}</p>
        </div>
      </div>
    </div>
  );
};

export default CompanyEventBasicStatistics;