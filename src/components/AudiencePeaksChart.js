import React from "react";
import ReactECharts from "echarts-for-react";

const AudiencePeaksChart = () => {
  // Datos de ejemplo: días de la semana y número de visitantes
  const daysOfWeek = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
  const visitorsData = [120, 200, 150, 80, 70, 110, 130]; // Ejemplo de datos

  // Opciones del gráfico ECharts
  const chartOptions = {
    title: {
      text: "Picos de Audiencia",
      left: "center",
      textStyle: {
        fontSize: 14,
        fontWeight: "bold",
      },
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "line",
      },
    },
    xAxis: {
      type: "category",
      data: daysOfWeek, // Días de la semana en el eje X
      boundaryGap: false, // Para que el área cubra todo el ancho
    },
    yAxis: {
      type: "value", // Número de visitantes en el eje Y
      name: "Visitantes",
      min: 0,
      max: Math.max(...visitorsData) + 50, // Ajustar el máximo dinámicamente
    },
    series: [
      {
        name: "Visitantes",
        type: "line",
        smooth: true, // Hacer el área suave
        areaStyle: {
          color: "#FFA500", // Color del área (naranja estándar)
          opacity: 0.3, // Opacidad del área
        },
        lineStyle: {
          color: "#FF4500", // Color de la línea (naranja rojizo)
          width: 2, // Grosor de la línea
        },
        itemStyle: {
          color: "#FF4500", // Color de los puntos (naranja rojizo)
        },
        data: visitorsData, // Datos de visitantes
      },
    ],
    grid: {
      left: "10%",
      right: "10%",
      bottom: "10%",
      containLabel: true,
    },
  };

  return (
    <div className="p-4">
      <ReactECharts option={chartOptions} style={{ height: "200px", width: "100%" }} />
    </div>
  );
};

export default AudiencePeaksChart;