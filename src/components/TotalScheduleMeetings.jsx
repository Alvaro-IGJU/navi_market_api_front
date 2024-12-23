import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandshake } from "@fortawesome/free-solid-svg-icons";
import api from "../api";

const TotalScheduleMeetings = ({ companyId }) => {
  const [totalMeetings, setTotalMeetings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchScheduledMeetings = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await api.get(`/interactions/companies/${companyId}/interactions/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const details = response.data.interaction_details || [];
        // Filtrar y sumar las reuniones agendadas
        const meetings = details.find((interaction) => interaction.interaction_type === "schedule_meeting");
        setTotalMeetings(meetings ? meetings.total_interactions : 0);
        setLoading(false);
      } catch (err) {
        console.error("Error al obtener reuniones agendadas:", err);
        setError("No se pudieron cargar las reuniones agendadas.");
        setLoading(false);
      }
    };

    fetchScheduledMeetings();
  }, [companyId]);

  if (loading) return <p className="text-gray-300">Cargando reuniones agendadas...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div
      className="bg-gray-50 p-6 rounded-lg flex flex-col items-center justify-center"
      style={{
        minWidth: "200px", // Tamaño mínimo del componente
        maxWidth: "300px", // Tamaño máximo del componente
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Sombra
        textAlign: "center",
      }}
    >
      <div className="text-3xl text-[#C7AA68] mb-4">
        <FontAwesomeIcon icon={faHandshake} />
      </div>
      <h2 className="text-lg font-bold text-black">Reuniones Agendadas</h2>
      <p className="text-xl font-bold text-[#C7AA68]">{totalMeetings}</p>
    </div>
  );
};

export default TotalScheduleMeetings;
