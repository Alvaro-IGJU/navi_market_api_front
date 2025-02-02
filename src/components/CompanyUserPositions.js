import React, { useEffect, useState } from "react";
import ReactECharts from 'echarts-for-react';
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

        const positionsData = response.data || [];
        const mappedData = positionsData.map((item) => ({
          position: item.position_title || "Desconocido",
          users: item.user_count,
        }));

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

  const orangeColors = [
    '#FFA500', // Naranja estándar
    '#FF8C00', // Naranja oscuro
    '#FF7F50', // Coral
    '#FF6347', // Tomate
    '#FF4500', // Naranja rojizo
    '#FFD700', // Oro
    '#FFA07A', // Salmón claro
    '#FF8C42', // Naranja intermedio
    '#FF6F61', // Naranja coral
  ];

  const getOption = () => {
    const sortedData = [...barData].sort((a, b) => b.users - a.users);
    const positions = sortedData.map(item => item.position);
    const users = sortedData.map(item => item.users);

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      xAxis: {
        type: 'value',
        max: Math.max(...users) + 10,
        axisLabel: {
          color: 'black'
        }
      },
      yAxis: {
        type: 'category',
        data: positions,
        axisLabel: {
          color: 'black'
        },
        inverse: true,
        animationDuration: 300,
        animationDurationUpdate: 300
      },
      series: [
        {
          name: 'Usuarios',
          type: 'bar',
          data: users.map((value, index) => ({
            value,
            itemStyle: {
              color: orangeColors[index % orangeColors.length]
            }
          })),
          label: {
            show: true,
            position: 'right',
            color: 'black'
          },
          animationDuration: 300,
          animationDurationUpdate: 300
        }
      ],
      grid: {
        left: '10%',
        right: '10%',
        bottom: '10%',
        containLabel: true
      },
      animation: true,
      animationDuration: 1000,
      animationEasing: 'linear',
      animationDurationUpdate: 1000,
      animationEasingUpdate: 'linear'
    };
  };

  return (
    <div className="p-6 pb-10 rounded-lg" style={{ height: "100%" }}>
      <h2 className="text-xl font-bold text-black mb-4 text-center">Posiciones de Usuarios</h2>
      {barData.length === 0 ? (
        <p className="text-gray-500 text-center">No hay datos disponibles para mostrar en el gráfico.</p>
      ) : (
        <ReactECharts
          option={getOption()}
          style={{ height: '200px', width: '100%' }}
        />
      )}
    </div>
  );
};

export default CompanyUserPositions;
