import React, { useEffect, useState } from "react";
import { ResponsiveBar } from "@nivo/bar";
import api from "../api";

const CompanyUserPositions = ({ companyId }) => {
  const [barData, setBarData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserPositionsData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await api.get(`/interactions/companies/${companyId}/user-positions/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Datos de posiciones de usuarios (raw):", response.data);

        const positionsData = response.data || [];
        console.log(positionsData)
        const mappedData = positionsData.map((item) => ({
          position: item.position_title || "Desconocido",
          users: item.user_count,
        }));

        console.log("Datos mapeados para el gráfico de barras:", mappedData);

        setBarData(mappedData);
        setLoading(false);
      } catch (err) {
        console.error("Error al obtener datos de posiciones de usuarios:", err);
        setError("No se pudieron cargar las posiciones de usuarios.");
        setLoading(false);
      }
    };

    fetchUserPositionsData();
  }, [companyId]);

  if (loading) return <p className="text-gray-300">Cargando gráfico de posiciones...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg" style={{ height: "500px" }}>
      <h2 className="text-xl font-bold text-[#C7AA68] mb-4 text-center">Posiciones de Usuarios</h2>
      <ResponsiveBar
        data={barData}
        keys={["users"]}
        indexBy="position"
        margin={{ top: 50, right: 50, bottom: 100, left: 60 }}
        padding={0.3}
        colors={{ scheme: "nivo" }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: -45,
          legend: "Posición",
          legendPosition: "middle",
          legendOffset: 70,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Cantidad de Usuarios",
          legendPosition: "middle",
          legendOffset: -50,
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{
          from: "color",
          modifiers: [["darker", 1.6]],
        }}
        tooltip={({ id, value, color }) => (
          <div
            style={{
              padding: "5px",
              color: "#fff",
              background: color,
              borderRadius: "3px",
            }}
          >
            <strong>{id}</strong>: {value}
          </div>
        )}
        theme={{
          axis: {
            ticks: {
              text: {
                fill: "#ffffff",
              },
            },
          },
          grid: {
            line: {
              stroke: "#444444",
              strokeWidth: 1,
            },
          },
        }}
      />
    </div>
  );
};

export default CompanyUserPositions;
