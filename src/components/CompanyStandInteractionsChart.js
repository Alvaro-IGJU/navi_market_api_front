import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLaptop, faEnvelope, faPlay, faHandshake, faPersonWalking, faBookOpen } from "@fortawesome/free-solid-svg-icons";
import api from "../api";

const CompanyStandInteractionsChart = ({ companyId }) => {
  const [interactionDetails, setInteractionDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const interactionTypeLabels = {
    stand_entry: { label: "Entradas a Stand", icon: faPersonWalking },
    info_pc: { label: "Clicks ordenador", icon: faLaptop },
    mailbox: { label: "Clicks MailBox", icon: faEnvelope },
    play_video: { label: "Clicks Reproducir Vídeo", icon: faPlay },
    schedule_meeting: { label: "Reuniones agendadas", icon: faHandshake },
    download_catalog: { label: "Catálogos descargados", icon: faBookOpen },
  };

  useEffect(() => {
    const fetchInteractions = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await api.get(`/interactions/companies/${companyId}/interactions/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const details = response.data.interaction_details || [];
        setInteractionDetails(details);
        setLoading(false);
      } catch (err) {
        console.error("Error al obtener las interacciones:", err);
        setError("No se pudieron cargar las interacciones.");
        setLoading(false);
      }
    };

    fetchInteractions();
  }, [companyId]);

  if (loading) return <p className="text-gray-300">Cargando interacciones...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-[#C7AA68] mb-4 text-center">Interacciones Totales por Tipo</h2>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {interactionDetails.map((interaction, index) => {
          const { label, icon } = interactionTypeLabels[interaction.interaction_type] || { label: interaction.interaction_type, icon: null };

          return (
            <div key={index} className="bg-gray-900 p-3 rounded-lg shadow-lg text-center">
              <div className="text-4xl mt-2 text-[#C7AA68]">
                {icon && <FontAwesomeIcon icon={icon} />}
              </div>
              <p className="text-lg text-white font-bold">{label}</p>
              <p className="text-2xl font-bold text-[#C7AA68]">{interaction.total_interactions}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CompanyStandInteractionsChart;
