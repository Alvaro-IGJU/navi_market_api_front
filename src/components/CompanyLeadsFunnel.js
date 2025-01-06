import React, { useEffect, useState } from "react";
import { ResponsiveFunnel } from "@nivo/funnel";
import api from "../api"; // Asegúrate de que esta importación apunte correctamente a tu cliente API

const CompanyLeadsFunnel = ({ companyId }) => {
  const [funnelData, setFunnelData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFunnelData = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      const response = await api.get(
        `/interactions/companies/${companyId}/interest-funnel/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const interestData = response.data || []; // Asegúrate de que los datos estén en formato de arreglo
      console.log("Datos del backend:", interestData);

      setFunnelData(interestData);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching funnel data:", err);
      setError("No se pudieron cargar los datos del embudo.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFunnelData();
  }, [companyId]);

  if (loading) return <p className="text-gray-300">Cargando datos del embudo...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6 pb-10 rounded-lg" style={{ height: "100%" }}>
      <h2 className="text-lg font-bold text-[#C7AA68] mb-4 text-center">Embudo de Interés</h2>
      <ResponsiveFunnel
        data={funnelData}
        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
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
