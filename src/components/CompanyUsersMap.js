import React, { useEffect, useState } from "react";
import { ResponsiveChoropleth } from "@nivo/geo";
import worldCountries from "../data/world_countries.json";
import api from "../api";

const CompanyUsersMap = ({ companyId }) => {
  const [mapData, setMapData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserLocationData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await api.get(`/interactions/companies/${companyId}/users-location/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // El backend devuelve los datos en formato { country_code: "USA", user_count: 100 }
        const locationData = response.data;

        // Mapear los datos para el componente Choropleth
        const mappedData = locationData.map((item) => ({
          id: item.country_code,
          value: item.user_count,
        }));

        setMapData(mappedData);
        setLoading(false);
      } catch (err) {
        console.error("Error al obtener datos de ubicación de usuarios:", err);
        setError("No se pudieron cargar los datos de ubicación de usuarios.");
        setLoading(false);
      }
    };

    fetchUserLocationData();
  }, [companyId]);

  if (loading) return <p className="text-gray-300">Cargando mapa de usuarios...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg" style={{ height: "500px" }}>
      <h2 className="text-xl font-bold text-[#C7AA68] mb-4 text-center">Mapa de Usuarios por País</h2>
      <ResponsiveChoropleth
        data={mapData}
        features={worldCountries.features}
        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        colors="nivo"
        domain={[0, Math.max(...mapData.map((d) => d.value), 100)]} // Ajusta el dominio dinámicamente
        unknownColor="#666666"
        label="properties.name"
        valueFormat=".0f"
        projectionTranslation={[0.5, 0.5]}
        projectionRotation={[0, 0, 0]}
        enableGraticule={true}
        graticuleLineColor="#dddddd"
        borderWidth={0.5}
        borderColor="#152538"
        legends={[
          {
            anchor: "bottom-left",
            direction: "column",
            justify: true,
            translateX: 20,
            translateY: -100,
            itemsSpacing: 0,
            itemWidth: 94,
            itemHeight: 18,
            itemDirection: "left-to-right",
            itemTextColor: "#ffffff",
            itemOpacity: 0.85,
            symbolSize: 18,
            effects: [
              {
                on: "hover",
                style: {
                  itemTextColor: "#000000",
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
      />
    </div>
  );
};

export default CompanyUsersMap;
