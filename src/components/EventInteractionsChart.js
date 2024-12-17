import React, { useEffect, useState } from "react";
import { ResponsiveBar } from "@nivo/bar";
import api from "../api";

const EventInteractionsChart = ({ companyId }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchInteractions = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await api.get(`/interactions/companies/${companyId}/interactions/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const formattedData = response.data.interaction_details.map((item) => ({
          interaction: item.interaction_type,
          interacciones: item.total_interactions,
        }));
        setData(formattedData);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };

    fetchInteractions();
  }, [companyId]);

  return (
    <div style={{ height: 400 }}>
      <ResponsiveBar
        data={data}
        keys={["interacciones"]}
        indexBy="interaction"
        margin={{ top: 50, right: 50, bottom: 50, left: 60 }}
        padding={0.3}
        colors={{ scheme: "nivo" }}
        axisBottom={{
          legend: "Tipo de Interacción",
          legendPosition: "middle",
          legendOffset: 32,
        }}
        axisLeft={{
          legend: "Cantidad",
          legendPosition: "middle",
          legendOffset: -40,
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor="#000" // Texto de las etiquetas en blanco
        // Personalización de estilos
        theme={{
          axis: {
            ticks: {
              text: {
                fill: "#fff", // Color de los números (ticks) en los ejes
              },
            },
            legend: {
              text: {
                fill: "#fff", // Color del texto de las leyendas
              },
            },
          },
          tooltip: {
            container: {
              background: "white",
              color: "black", // Color del texto en el tooltip
              fontSize: "14px",
              borderRadius: "4px",
              boxShadow: "0 3px 6px rgba(0, 0, 0, 0.2)",
            },
          },
        }}
      />
    </div>
  );
};

export default EventInteractionsChart;
