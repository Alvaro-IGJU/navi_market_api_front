import React, { useEffect, useState } from "react";
import { ResponsivePie } from "@nivo/pie";
import api from "../api";

const CompanyUserSectorsPieChart = ({ companyId }) => {
  const [sectorData, setSectorData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSectorData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await api.get(
          `/interactions/companies/${companyId}/user-sectors/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Mapear los datos para el formato requerido por Nivo Pie Chart
        const mappedData = response.data.map((item) => ({
          id: item.sector_name,
          label: item.sector_name,
          value: item.user_count,
        }));

        setSectorData(mappedData);
        setLoading(false);
      } catch (err) {
        console.error("Error al obtener datos de sectores:", err);
        setError("No se pudieron cargar los datos de sectores.");
        setLoading(false);
      }
    };

    fetchSectorData();
  }, [companyId]);

  if (loading) return <p className="text-gray-300">Cargando datos de sectores...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg" style={{ height: "500px" }}>
      <h2 className="text-xl font-bold text-[#C7AA68] mb-4 text-center">Sectores de Usuarios</h2>
      <ResponsivePie
        data={sectorData}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        innerRadius={0}
        padAngle={0.7}
        cornerRadius={3}
        activeOuterRadiusOffset={8}
        colors={{ scheme: "nivo" }}
        borderWidth={1}
        borderColor={{
          from: "color",
          modifiers: [["darker", 0.2]],
        }}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor="#ffffff"
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: "color" }}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{
          from: "color",
          modifiers: [["darker", 2]],
        }}
      />
    </div>
  );
};

export default CompanyUserSectorsPieChart;
