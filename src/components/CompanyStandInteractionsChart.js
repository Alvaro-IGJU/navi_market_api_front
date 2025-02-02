import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";

const CompanyStandInteractionsChart = ({ interactionsData }) => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!interactionsData || !interactionsData.interaction_details) {
      setChartData([]);
      setLoading(false);
      return;
    }

    // Definir tonalidades de naranja para cada tipo de interacción
    const interactionColors = {
      stand_entry: "#FFA500", // Naranja estándar
      info_pc: "#FF8C00", // Naranja oscuro
      mailbox: "#FF7F50", // Coral
      play_video: "#FF6347", // Tomate
      download_catalog: "#FF4500", // Naranja rojizo
      talk_chatbot: "#FFD700", // Oro
    };

    // Filtrar y mapear los datos
    const filteredData = interactionsData.interaction_details
      .filter((item) => item.interaction_type !== "schedule_meeting")
      .map((item) => ({
        name: item.interaction_type.replace(/_/g, " ").toUpperCase(),
        value: item.total_interactions,
        color: interactionColors[item.interaction_type] || "#FFA500", // Usar naranja por defecto si no hay color definido
      }));

    setChartData(filteredData);
    setLoading(false);
  }, [interactionsData]);

  if (loading) return <p className="text-gray-300">Cargando interacciones...</p>;
  if (!chartData.length)
    return <p className="text-gray-500 text-center">No hay datos disponibles.</p>;

  return (
    <div className="rounded-lg">
      <h2 className="text-lg font-bold text-[#1B1B1B] mb-4 text-center">
        Interacciones Stand
      </h2>
      <ReactECharts
        option={{
          tooltip: { trigger: "item" },
          radar: {
            indicator: chartData.map((item) => ({
              name: item.name,
              max: Math.max(...chartData.map((d) => d.value)),
            })),
          },
          series: [
            {
              type: "radar",
              data: [
                {
                  value: chartData.map((item) => item.value),
                  itemStyle: { color: "#FFA500" }, // Color principal del área (naranja estándar)
                  areaStyle: { color: "#FFA500", opacity: 0.3 }, // Relleno con opacidad
                },
              ],
            },
          ],
          color: chartData.map((item) => item.color), // Colores dinámicos para cada interacción
        }}
        style={{ height: "200px", width: "100%" }}
      />
    </div>
  );
};

export default CompanyStandInteractionsChart;