import React, { useEffect, useState } from 'react';
import { ResponsiveCalendar } from '@nivo/calendar';

const AdminEventVisitsChart = ({ eventsData }) => {
  const [formattedData, setFormattedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const formatData = () => {
      try {
        if (!eventsData || !eventsData.events || !Array.isArray(eventsData.events) || eventsData.events.length === 0) {
          setError("No hay datos de eventos disponibles.");
          setLoading(false);
          return;
        }

        const data = eventsData.events.flatMap((event) =>
          event.visits.map((visit) => ({
            day: visit.date,
            value: visit.total_visits,
          }))
        );

        setFormattedData(data);
        setLoading(false);
      } catch (err) {
        console.error("Error al formatear los datos:", err);
        setError("No se pudieron cargar las visitas.");
        setLoading(false);
      }
    };

    formatData();
  }, [eventsData]);

  if (loading) return <p className="text-gray-300 text-center">Cargando visitas...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  // Verificar los datos

  const fromDate = "2024-12-11"; // Cambié las fechas de inicio y fin para que cubran todo el rango de datos
  const toDate = "2024-12-20";

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-xl mb-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-[#C7AA68] text-center">Evolución de Visitas a los Eventos</h2>
      <div className="relative h-96 w-full">
        <ResponsiveCalendar
          data={formattedData}
          from={fromDate}
          to={toDate}
          emptyColor="#222222" // Fondo oscuro para días sin datos
          colors={["#C7AA68", "#f47560", "#97e3d5", "#61cdbb"]} // Colores personalizados (puedes modificar estos colores)
          margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
          yearSpacing={40}
          monthBorderColor="#444444" // Bordes más oscuros para una sensación más moderna
          dayBorderWidth={2}
          dayBorderColor="#333333" // Bordes de los días
          legends={[
            {
              anchor: 'bottom-right',
              direction: 'row',
              translateY: 36,
              itemCount: 4,
              itemWidth: 42,
              itemHeight: 36,
              itemsSpacing: 14,
              itemDirection: 'right-to-left',
            },
          ]}
          theme={{
            axis: {
              ticks: {
                text: {
                  fill: '#ffffff', // Cambiar el color del texto de los años y los meses a blanco
                },
              },
            },
            labels: {
              text: {
                fill: '#ffffff', // Cambiar el color de las etiquetas de los meses a blanco
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default AdminEventVisitsChart;
