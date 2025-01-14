import React, { useEffect, useState } from "react";
import { ResponsiveFunnel } from "@nivo/funnel";
import api from "../api";

const CompanyLeadsFunnel = ({ companyId }) => {
  const [funnelData, setFunnelData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFunnelData = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      const response = await api.get(
        `/interactions/companies/${companyId}/interest-funnel/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const interestData = response.data || [];

      // Ordenar los datos en el orden deseado
      const order = [
        "Usuarios Confundidos",
        "Usuarios Lejanos",
        "Usuarios Curiosos",
        "Usuarios Exploradores",
        "Usuarios Evaluadores",
        "Usuarios Estratégicos",
        "Usuarios Decididos",
      ];

      const formattedData = interestData
        .map((item) => ({
          id: item.category.toLowerCase().replace(/\s+/g, "_"), // Ejemplo: "Usuarios Decididos" -> "usuarios_decididos"
          value: item.count,
          label: item.category,
        }))
        .sort((a, b) => order.indexOf(a.label) - order.indexOf(b.label)); // Ordenar según el array `order`

      setFunnelData(formattedData);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching funnel data:", err);
      setError("No se pudieron cargar los datos del embudo.");
      setLoading(false);
    }
  };

  // Definir los colores personalizados para cada categoría
  const getColorByCategory = (id) => {
    const redCategories = ["usuarios_confundidos", "usuarios_lejanos"];
    const orangeCategories = ["usuarios_curiosos", "usuarios_exploradores"];
    const greenCategories = [
      "usuarios_evaluadores",
      "usuarios_estratégicos",
      "usuarios_decididos",
    ];

    if (redCategories.includes(id)) return "#ffcccc"; // Rojo suave
    if (orangeCategories.includes(id)) return "#ffe4b5"; // Naranja suave
    if (greenCategories.includes(id)) return "#d4f7d4"; // Verde suave

    return "#cccccc"; // Gris por defecto si no coincide
  };

  useEffect(() => {
    fetchFunnelData();
  }, [companyId]);

  if (loading) return <p className="text-gray-300">Cargando datos del embudo...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6 pb-10 rounded-lg" style={{ height: "100%" }}>
      <h2 className="text-lg font-bold text-[#C7AA68] mb-4 text-center">Embudo de Interés</h2>
      {funnelData.length === 0 ? (
        <p className="text-gray-500 text-center">No hay datos disponibles para mostrar en el funnel.</p>
      ) : (
        <ResponsiveFunnel
          data={funnelData}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          valueFormat=">-.4s"
          colors={({ id }) => getColorByCategory(id)} // Asignar colores personalizados
          borderWidth={20}
          labelColor={{
            from: "color",
            modifiers: [["darker", 3]],
          }}
          beforeSeparatorLength={100}
          beforeSeparatorOffset={20}
          afterSeparatorLength={100}
          afterSeparatorOffset={20}
          currentPartSizeExtension={10}
          currentBorderWidth={40}
          motionConfig="wobbly"
        />
      )}
    </div>
  );
};

export default CompanyLeadsFunnel;
