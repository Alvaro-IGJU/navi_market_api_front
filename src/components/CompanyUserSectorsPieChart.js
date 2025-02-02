import React, { useEffect, useState } from "react";
import ReactECharts from 'echarts-for-react';
import api from "../api";

const CompanyUserSectorsBarRace = ({ companyId }) => {
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

        // Mapear los datos para el formato requerido por ECharts
        const mappedData = response.data.map((item) => ({
          sector: item.sector_name,
          users: item.user_count,
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

  const getOption = () => {
    const sortedData = [...sectorData].sort((a, b) => b.users - a.users);
    const sectors = sortedData.map(item => item.sector);
    const users = sortedData.map(item => item.users);

    // Array de tonalidades de naranja
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

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      xAxis: {
        type: 'value',
        max: Math.max(...users) + 10, // Añade un margen para que no se pegue el número al borde
        axisLabel: {
          color: 'black'
        }
      },
      yAxis: {
        type: 'category',
        data: sectors,
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
          data: users,
          label: {
            show: true,
            position: 'right',
            color: 'black'
          },
          itemStyle: {
            color: (params) => {
              // Asigna colores del array de tonalidades naranjas
              return orangeColors[params.dataIndex % orangeColors.length];
            }
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
      <h2 className="text-xl font-bold text-black mb-4 text-center">Sectores de Usuarios</h2>
      {sectorData.length === 0 ? (
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

export default CompanyUserSectorsBarRace;