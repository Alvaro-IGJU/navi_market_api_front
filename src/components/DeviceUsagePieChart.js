import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";

const DeviceUsagePieChart = () => {
  // Generar valores aleatorios para PC, Tablet y Móvil
  const [deviceData, setDeviceData] = useState([]);

  useEffect(() => {
    const generateRandomData = () => {
      const devices = ["PC", "Tablet", "Móvil"];
      const randomValues = Array.from({ length: 3 }, () => Math.floor(Math.random() * 100) + 1); // Valores entre 1 y 100
      const data = devices.map((device, index) => ({
        name: device,
        value: randomValues[index],
      }));
      setDeviceData(data);
    };
    // Generar datos al cargar el componente
    generateRandomData();
  }, []);

  // Opciones del gráfico ECharts
  const chartOptions = {
    title: {
      text: "Uso de Dispositivos",
      left: "center",
      textStyle: {
        fontSize: 14,
        fontWeight: "bold",
      },
    },
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b}: {c} ({d}%)", // Mostrar nombre, valor y porcentaje
    },
    legend: {
      orient: "vertical",
      left: "left",
      data: ["PC", "Tablet", "Móvil"], // Etiquetas de las categorías
    },
    series: [
      {
        name: "Dispositivos",
        type: "pie",
        radius: "50%", // Tamaño del gráfico de pastel
        data: deviceData, // Datos dinámicos
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
    color: ["#FFA500", "#FF8C00", "#FF4500"], // Tonalidades naranjas para PC, Tablet y Móvil
  };

  return (
    <div className="p-4">
      <ReactECharts option={chartOptions} style={{ height: "500px", width: "100%" }} />
    </div>
  );
};

export default DeviceUsagePieChart;