import React from "react";
import { ResponsiveBar } from "@nivo/bar";

const StandInteractionsChart = ({ standName, interactions, totalDuration, onClose }) => {
  const chartData = interactions.map((item) => ({
    interaction: item.interaction_type,
    interacciones: item.total_interactions,
    duracion: item.total_duration,
  }));

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-90 flex items-center justify-center p-4">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-3xl relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white text-xl"
        >
          &times;
        </button>
        <h2 className="text-2xl font-semibold text-[#C7AA68] mb-4">
          Detalle de Interacciones: {standName}
        </h2>

        {/* Tiempo Total en el Stand */}
        <div className="bg-gray-700 p-4 rounded-md text-center mb-4">
          <h3 className="text-lg font-bold mb-2 text-[#C7AA68]">Tiempo Total en el Stand</h3>
          <p className="text-2xl font-semibold">
            {Math.floor(totalDuration / 60)} minutos {totalDuration % 60} segundos
          </p>
        </div>

        {/* Gráfico de Barras */}
        <div style={{ height: 400 }}>
          <ResponsiveBar
            data={chartData}
            keys={["interacciones", "duracion"]}
            indexBy="interaction"
            margin={{ top: 50, right: 50, bottom: 50, left: 60 }}
            padding={0.3}
            colors={{ scheme: "set2" }}
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
            labelTextColor="#000"
            // Personalización del Tooltip
        theme={{
            tooltip: {
              container: {
                background: "white",
                color: "black", // Texto del tooltip en negro
                fontSize: "14px",
                borderRadius: "4px",
                boxShadow: "0 3px 6px rgba(0, 0, 0, 0.2)",
              },
            },
          }}
          />
        </div>
      </div>
    </div>
  );
};

export default StandInteractionsChart;
