import React, { useEffect, useState } from "react";
import { ResponsiveLine } from "@nivo/line";
import api from "../api";

const EventVisitsChart = ({ companyId }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVisits = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await api.get(`/interactions/companies/${companyId}/events-visits/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Respuesta del backend:", response.data);

        // Asegúrate de acceder a "events" dentro de response.data
        const events = response.data.events;

        // Formatear los datos para Nivo
        const formattedData = events.map((event) => ({
          id: event.event_name, // Nombre del evento como línea
          data: event.visits.map((visit) => ({
            x: visit.date, // Fecha de la visita
            y: visit.total_visits, // Total de visitas en esa fecha
          })),
        }));

        setData(formattedData);
        setLoading(false);
      } catch (err) {
        console.error("Error al obtener las visitas:", err);
        setError("No se pudieron cargar las visitas a los eventos.");
        setLoading(false);
      }
    };

    fetchVisits();
  }, [companyId]);

  if (loading) return <p className="text-gray-300">Cargando visitas...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6" style={{ height: 400 }}>
      <h2 className="text-xl font-bold mb-4 text-[#C7AA68]">Evolución de Visitas a los Eventos</h2>
      <ResponsiveLine
        data={data}
        margin={{ top: 50, right: 50, bottom: 50, left: 60 }}
        xScale={{ type: "point" }}
        yScale={{ type: "linear", min: "auto", max: "auto", stacked: false, reverse: false }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: -45,
          legend: "Fecha",
          legendOffset: 36,
          legendPosition: "middle",
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Visitas",
          legendOffset: -50,
          legendPosition: "middle",
        }}
        colors={{ scheme: "nivo" }}
        lineWidth={3}
        pointSize={10}
        pointColor={{ theme: "background" }}
        pointBorderWidth={2}
        pointBorderColor={{ from: "serieColor" }}
        pointLabel="y"
        pointLabelYOffset={-12}
        useMesh={true}
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
              stroke: "#444",
              strokeWidth: 1,
            },
          },
          tooltip: {
            container: {
              background: "white",
              color: "black",
              fontSize: "14px",
            },
          },
        }}
      />
    </div>
  );
};

export default EventVisitsChart;
