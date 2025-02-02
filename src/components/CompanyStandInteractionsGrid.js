import React, { useEffect, useState } from "react";

const CompanyStandInteractionsGrid = ({ interactionsData }) => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!interactionsData || !interactionsData.interaction_details) {
      setTableData([]);
      setLoading(false);
      return;
    }

    const filteredData = interactionsData.interaction_details
      .filter((item) => item.interaction_type !== "schedule_meeting")
      .map((item) => ({
        name: item.interaction_type.replace(/_/g, " ").toUpperCase(),
        value: item.total_interactions,
      }));

    // Añadir reuniones agendadas como una fila adicional
    const scheduleMeeting = interactionsData.interaction_details.find(
      (interaction) => interaction.interaction_type === "schedule_meeting"
    );
    if (scheduleMeeting) {
      filteredData.push({
        name: "REUNIONES AGENDADAS",
        value: scheduleMeeting.total_interactions,
      });
    }

    // Asegurarse de que siempre haya 6 elementos (3x2)
    while (filteredData.length < 6) {
      filteredData.push({ name: "", value: "" }); // Espacios vacíos
    }
    filteredData.splice(6); // Limitar a 6 elementos

    setTableData(filteredData);
    setLoading(false);
  }, [interactionsData]);

  if (loading) return <p className="text-gray-300">Cargando interacciones...</p>;
  if (!tableData.length) return <p className="text-gray-500 text-center">No hay datos disponibles.</p>;

  return (
    <div className="rounded-lg">
      <table className="w-full border-collapse text-[0.4rem] sm:text-[0.5rem]">
        <tbody>
          {/* Dividir los datos en filas de 3 columnas */}
          {[0, 1].map((rowIndex) => (
            <tr key={rowIndex} className="border-b last:border-b-0">
              {tableData.slice(rowIndex * 3, rowIndex * 3 + 3).map((item, colIndex) => (
                <td
                  key={colIndex}
                  className="p-0 border border-gray-300"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "2px", // Espacio mínimo entre variable y valor
                    height: "20px", // Altura fija para cada celda
                  }}
                >
                  <p className="font-bold">{item.name}</p>
                  <p>{item.value}</p>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CompanyStandInteractionsGrid;