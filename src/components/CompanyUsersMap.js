import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import api from "../api";
import * as echarts from "echarts";
import worldCountries from "../data/world_countries.json";
import isoCountries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";

// Registrar idioma y mapa
isoCountries.registerLocale(enLocale);
echarts.registerMap("world", worldCountries);

const CompanyUsersMap = ({ companyId }) => {
  const [mapData, setMapData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/interactions/companies/${companyId}/users-location/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
      })
      .then(({ data }) =>
        setMapData(
          data.map((item) => ({
            name: isoCountries.getName(item.id, "en") || item.id,
            value: item.value || 0,
          }))
        )
      )
      .catch(() => setMapData([]))
      .finally(() => setLoading(false));
  }, [companyId]);

  if (loading) return <p className="text-gray-300">Cargando mapa...</p>;

  return (
    <>
      <h2 className="text-lg font-bold text-[#1B1B1B] text-center mb-2">Mapa de Usuarios</h2>
      <ReactECharts
        option={{
          tooltip: {
            trigger: "item",
            formatter: ({ name, value }) => `${name}: ${value ?? 0} usuarios`,
          },
          visualMap: {
            min: 0,
            max: Math.max(...mapData.map((d) => d.value), 100),
            left: "right",
            top: "bottom",
            inRange: {
              color: ["#FFECB3", "#FF6F00"], // Gradiente de naranja claro a oscuro
            },
          },
          series: [
            {
              type: "map",
              map: "world",
              roam: true,
              emphasis: {
                label: { show: false },
              },
              data: mapData,
            },
          ],
        }}
        style={{ height: "250px", width: "100%", margin: "0" }} // Remover márgenes
      />
    </>
  );
};

export default CompanyUsersMap;