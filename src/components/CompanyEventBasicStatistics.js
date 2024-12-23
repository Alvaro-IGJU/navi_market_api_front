import React, { useEffect, useState } from "react";
import api from "../api";

const CompanyEventBasicStatistics = ({ companyId, interactionsData }) => {
  const [totalVisits, setTotalVisits] = useState(0);
  const [averageTimePerStand, setAverageTimePerStand] = useState(0);
  const [uniqueUsers, setUniqueUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        // Mantén esta llamada
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

        // Usa interactionsData para calcular estadísticas
        if (!interactionsData || !interactionsData.stands_details) {
          throw new Error("interactionsData no disponible.");
        }

        const { stands_details, unique_users } = interactionsData;

        let totalAverageDuration = 0;
        let standEntryCount = 0;

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
        setUniqueUsers(unique_users || 0);
        setLoading(false);
      } catch (err) {
        console.error("Error al obtener las estadísticas:", err);
        setError("No se pudieron cargar las estadísticas.");
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [companyId, interactionsData]);

  if (loading) return <p className="text-gray-300">Cargando estadísticas...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div
      className="p-4 rounded-lg h-full flex flex-col"
      style={{
        minWidth: "150px",
        minHeight: "100px",
        overflow: "hidden",
        resize: "both",
      }}
    >
      <h2 className="text-lg font-bold text-[#C7AA68] mb-4 text-center">Estadísticas de Visitas</h2>
      <div className="flex flex-col gap-2 flex-grow">
        {/* Total de Visitas */}
        <div
          className="bg-gray-50 p-3 rounded-lg flex flex-col items-center justify-center flex-1"
          style={{ minHeight: "50px" }}
        >
          <p className="text-sm font-bold text-black">Visitas totales:</p>
          <p className="text-base font-bold text-black">{totalVisits}</p>
        </div>
        {/* Última Fila: Tiempo promedio y Usuarios únicos */}
        <div className="flex gap-2 flex-1">
          {/* Tiempo promedio en stand */}
          <div
            className="bg-gray-50 p-3 rounded-lg flex flex-col items-center justify-center flex-1"
            style={{ minHeight: "50px" }}
          >
            <p className="text-xs text-black text-center">Tiempo Promedio:</p>
            <p className="text-sm font-bold text-black text-center">
              {Math.floor(averageTimePerStand / 60)}m {Math.floor(averageTimePerStand % 60)}s
            </p>
          </div>
          {/* Usuarios únicos */}
          <div
            className="bg-gray-50 p-3 rounded-lg flex flex-col items-center justify-center flex-1"
            style={{ minHeight: "50px" }}
          >
            <p className="text-xs text-black text-center">Usuarios Únicos:</p>
            <p className="text-sm font-bold text-black text-center">{uniqueUsers}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyEventBasicStatistics;
