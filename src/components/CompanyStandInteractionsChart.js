import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLaptop, faEnvelope, faPlay, faPersonWalking, faBookOpen, faRobot } from "@fortawesome/free-solid-svg-icons";

const CompanyStandInteractionsChart = ({ interactionsData }) => {
  const [interactionDetails, setInteractionDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const interactionTypeLabels = {
    stand_entry: { label: "Entradas a Stand", icon: faPersonWalking },
    info_pc: { label: "Clicks ordenador", icon: faLaptop },
    mailbox: { label: "Clicks MailBox", icon: faEnvelope },
    play_video: { label: "Clicks en Vídeo", icon: faPlay },
    download_catalog: { label: "Catálogos descargados", icon: faBookOpen },
    talk_chatbot: { label: "Interacciones Chatbot", icon: faRobot },
    // Removed `schedule_meeting` from this object
  };

  useEffect(() => {
    try {
      if (!interactionsData || !interactionsData.interaction_details) {
        throw new Error("Datos de interacción no disponibles.");
      }

      const details = interactionsData.interaction_details || [];
      setInteractionDetails(details);
      setLoading(false);
    } catch (err) {
      console.error("Error al procesar las interacciones:", err);
      setError("No se pudieron cargar las interacciones.");
      setLoading(false);
    }
  }, [interactionsData]);

  if (loading) return <p className="text-gray-300">Cargando interacciones...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div
      className="p-6 rounded-lg h-full flex flex-col"
      style={{
        minWidth: "200px", // Tamaño mínimo del componente
        overflow: "hidden", // Asegura que el contenido no desborde
        resize: "both", // Permite redimensionar manualmente
      }}
    >
      <h2 className="text-lg font-bold text-[#C7AA68] mb-4 text-center">Interacciones Stand</h2>
      <div
        className="grid gap-4 flex-grow"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", // Columnas flexibles
        }}
      >
        {interactionDetails
          .filter((interaction) => interaction.interaction_type !== "schedule_meeting") // Filtrar schedule_meeting
          .map((interaction, index) => {
            const { label, icon } = interactionTypeLabels[interaction.interaction_type] || {
              label: interaction.interaction_type,
              icon: null,
            };

            return (
              <div
                key={index}
                className="bg-gray-50 rounded-lg flex flex-col items-center justify-center"
                style={{
                  minWidth: "50px", // Tamaño mínimo de cada tarjeta
                  minHeight: "50px", // Altura mínima de cada tarjeta
                  flex: "1 1 auto", // Crecimiento y reducción flexible
                }}
              >
                <div className="text-3xl mt-2 text-[#C7AA68]">
                  {icon && <FontAwesomeIcon icon={icon} />}
                </div>
                <p className="text-base text-black font-bold">{label}</p>
                <p className="text-xl font-bold text-[#C7AA68]">{interaction.total_interactions}</p>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default CompanyStandInteractionsChart;
