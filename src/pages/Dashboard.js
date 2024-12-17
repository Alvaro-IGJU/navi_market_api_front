import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import EventInteractionsChart from "../components/EventInteractionsChart";
import StandInteractionsChart from "../components/StandInteractionsChart";
import EventVisitsChart from "../components/EventVisitsChart"; // Nuevo componente
import api from "../api";

const Dashboard = () => {
  const [stands, setStands] = useState([]);
  const [selectedStand, setSelectedStand] = useState(null);
  const [totalTime, setTotalTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const companyId = 1; // ID de la empresa actual

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await api.get(`/interactions/companies/${companyId}/interactions/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const standsDetails = response.data.stands_details;
        const totalDuration = response.data.interaction_details.reduce(
          (sum, item) => sum + item.total_duration,
          0
        );

        setStands(standsDetails);
        setTotalTime(totalDuration);
        setLoading(false);
      } catch (err) {
        console.error("Error al obtener los datos:", err);
        setError("No se pudieron cargar las estadísticas.");
        setLoading(false);
      }
    };

    fetchData();
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

        {/* Tabla de Stands */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-4">
          <h2 className="text-xl font-semibold text-[#C7AA68] mb-4">Interacciones por Stand</h2>
          <table className="w-full text-left table-auto mb-4">
            <thead>
              <tr className="text-gray-400">
                <th className="px-4 py-2">Nombre del Stand</th>
                <th className="px-4 py-2">Evento</th>
                <th className="px-4 py-2">Total Interacciones</th>
                <th className="px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {stands.map((stand) => (
                <tr key={stand.stand_id} className="border-b border-gray-700">
                  <td className="px-4 py-2">{stand.stand_name}</td>
                  <td className="px-4 py-2">{stand.event_name}</td>
                  <td className="px-4 py-2">{stand.total_interactions}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => setSelectedStand(stand)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Ver Detalle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Dashboard específico del stand */}
        {selectedStand && (
          <StandInteractionsChart
            standName={selectedStand.stand_name}
            interactions={selectedStand.interaction_details}
            totalDuration={selectedStand.interaction_details.reduce(
              (sum, item) => sum + item.total_duration,
              0
            )}
            onClose={() => setSelectedStand(null)}
          />
        )}
      </div>
    </>
  );
};

export default Dashboard;
