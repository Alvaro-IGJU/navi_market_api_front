import React, { useEffect, useState } from "react";
import { ResponsiveFunnel } from "@nivo/funnel";
import api from "../api";

const CompanyLeadsFunnel = ({ companyId }) => {
  const [funnelData, setFunnelData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFunnelData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await api.get(`/interactions/companies/${companyId}/interactions/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const { interaction_details } = response.data;

        const standVisits =
          interaction_details.find((detail) => detail.interaction_type === "stand_entry")
            ?.total_interactions || 0;
        const catalogDownloads =
          interaction_details.find((detail) => detail.interaction_type === "download_catalog")
            ?.total_interactions || 0;
        const meetingsScheduled =
          interaction_details.find((detail) => detail.interaction_type === "schedule_meeting")
            ?.total_interactions || 0;

        // Preparar datos para el funnel
        const funnelData = [
          { id: "Visitas al Stand", value: standVisits },
          { id: "Descargas de Catálogo", value: catalogDownloads },
          { id: "Reuniones Agendadas", value: meetingsScheduled },
        ];

        setFunnelData(funnelData);
        setLoading(false);
      } catch (err) {
        console.error("Error al obtener datos del embudo:", err);
        setError("No se pudieron cargar los datos del embudo.");
        setLoading(false);
      }
    };

    fetchFunnelData();
  }, [companyId]);

  if (loading) return <p className="text-gray-300">Cargando datos del embudo...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className=" p-6 pb-10 rounded-lg " style={{ height: "100%" }}>
      <h2 className="text-lg font-bold text-[#C7AA68] mb-4 text-center">Embudo de Leads</h2>
      <ResponsiveFunnel
        data={funnelData}
        margin={{  right: 20, bottom: 20, left: 20 }}
        valueFormat=">-.4s"
        colors={{ scheme: "spectral" }}
        borderWidth={20}
        labelColor={{
          from: "color",
          modifiers: [["darker", 3]],
        }}
        beforeSeparatorLength={100}
        beforeSeparatorOffset={20}
        afterSeparatorLength={100}
        afterSeparatorOffset={20}
        currentPartSizeExtension={10}
        currentBorderWidth={40}
        motionConfig="wobbly"
        
      />
    </div>
  );
};

export default CompanyLeadsFunnel;
