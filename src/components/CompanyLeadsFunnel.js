import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import api from "../api";

const CompanyLeadsFunnel = ({ companyId }) => {
  const [funnelData, setFunnelData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/interactions/companies/${companyId}/interest-funnel/`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
    })
      .then(({ data }) => {
        const order = [
          "Usuarios Confundidos", "Usuarios Lejanos", "Usuarios Curiosos",
          "Usuarios Exploradores", "Usuarios Evaluadores", "Usuarios Estratégicos", "Usuarios Decididos"
        ];

        // Aseguramos que todas las fases estén presentes, incluso si no hay datos
        const fullFunnelData = order.map((category) => {
          const found = data.find((item) => item.category === category);
          return { name: category, value: found ? found.count : 0 };
        });

        // Ordenar los datos según las fases definidas
        setFunnelData(fullFunnelData);
      })
      .catch(() => setFunnelData([]))
      .finally(() => setLoading(false));
  }, [companyId]);

  if (loading) return <p className="text-black-300">Cargando embudo...</p>;
  if (!funnelData.length) return <p className="text-gray-500 text-center">No hay datos disponibles.</p>;

  // Definir el color base para "Usuarios Exploradores"
  const baseColor = "#FF7F00"; // Naranja oscuro para "Usuarios Exploradores"
  
  // Función para hacer los colores más claros en función del color base
  const lightenColor = (color, factor) => {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    const newR = Math.min(255, r + factor);
    const newG = Math.min(255, g + factor);
    const newB = Math.min(255, b + factor);
    return `#${newR.toString(16).padStart(2, "0")}${newG.toString(16).padStart(2, "0")}${newB.toString(16).padStart(2, "0")}`;
  };

  // Asignar colores más claros a las fases en función de su posición
  const colorMapping = {
    "Usuarios Confundidos": lightenColor(baseColor, 60),
    "Usuarios Lejanos": lightenColor(baseColor, 50),
    "Usuarios Curiosos": lightenColor(baseColor, 40),
    "Usuarios Exploradores": baseColor, // Color base más oscuro
    "Usuarios Evaluadores": lightenColor(baseColor, -10), // Más oscuro
    "Usuarios Estratégicos": lightenColor(baseColor, -20), // Más oscuro
    "Usuarios Decididos": lightenColor(baseColor, -30), // Más oscuro
  };

  return (
    <div className="rounded-lg">
      <h2 className="text-lg font-bold text-[#1B1B1B] text-center mb-2">Embudo de Interés</h2>
      <ReactECharts
        option={{
          tooltip: { trigger: "item", formatter: "{b}: {c}" },
          series: [{
            type: "funnel",
            left: "5%", // Reducimos el espacio lateral
            width: "90%", // Aseguramos que el gráfico use más espacio
            minSize: "5%", // Hacemos que el embudo sea más compacto
            maxSize: "95%",
            label: { show: true, position: "inside" },
            data: funnelData.map((item) => ({
              name: item.name,
              value: item.value,
              itemStyle: {
                color: item.value > 0 ? colorMapping[item.name] : lightenColor(baseColor, 80), // Si no hay datos, color más claro
              }
            }))
          }]
        }}
        style={{ height: "400px", width: "100%", marginTop: "-10px" }} // Ajustamos el margen
      />
    </div>
  );
};

export default CompanyLeadsFunnel;
