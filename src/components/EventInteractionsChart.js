import React, { useEffect, useState } from "react";
import { ResponsiveBar } from "@nivo/bar";
import api from "../api";

const EventInteractionsChart = ({ eventId }) => {
  const [data, setData] = useState([]);
  const [totalDuration, setTotalDuration] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInteractions = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await api.get(`/interactions/companies/${eventId}/interactions/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Respuesta de la API:", response.data);

        // Extraer y formatear los datos
        const formattedData = response.data.interaction_details.map((detail) => ({
          tipo_interaccion: detail.interaction_type,
          interacciones: detail.total_interactions,
        }));

        // Calcular el tiempo total en el stand
        const totalDuration = response.data.interaction_details.reduce(
          (sum, detail) => sum + detail.total_duration,
          0
        );

        setData(formattedData);
        setTotalDuration(totalDuration);
        setLoading(false);
      } catch (err) {
        console.error("Error al obtener datos de interacciones:", err);
        setError("No se pudieron cargar las estadísticas.");
        setLoading(false);
      }
    };

    fetchInteractions();
  }, [eventId]);

  if (loading) return <p className="text-gray-300">Cargando datos...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="space-y-6">
      {/* Sección de Tiempo Total en el Stand */}
      <div className="bg-gray-700 text-white p-4 rounded-md text-center">
        <h2 className="text-xl font-bold mb-2 text-[#C7AA68]">Tiempo Total en el Stand</h2>
        <p className="text-3xl font-semibold">
          {Math.floor(totalDuration / 60)} minutos {totalDuration % 60} segundos
        </p>
      </div>

      {/* Gráfico de Barras para Interacciones */}
      <div style={{ height: 400 }} className="bg-gray-800 p-4 rounded-md">
        <h2 className="text-xl font-bold mb-4 text-[#C7AA68]">Interacciones por Tipo</h2>
        <ResponsiveBar
          data={data}
          keys={["interacciones"]}
          indexBy="tipo_interaccion"
          margin={{ top: 50, right: 50, bottom: 50, left: 60 }}
          padding={0.3}
          colors={{ scheme: "nivo" }}
          borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Tipo de Interacción",
            legendPosition: "middle",
            legendOffset: 32,
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Cantidad",
            legendPosition: "middle",
            legendOffset: -40,
          }}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
          animate={true}
          motionStiffness={90}
          motionDamping={15}
        />
      </div>
    </div>
  );
};

export default EventInteractionsChart;
