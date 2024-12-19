import React, { useRef, useEffect, useState, useContext } from "react";
import { Environment } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { CharacterController } from "./CharacterController";
import Stand from "./Stand";
import Base from "./Base";
import api from "../api";
import { AuthContext } from "../contexts/AuthContext";
import { getStandCoordinates } from "../utils/standPositions";
import { getBasePosition } from "../utils/basePosition";

const Experience = ({ eventId }) => {
  const characterRef = useRef();
  const { user } = useContext(AuthContext);
  const [stands, setStands] = useState([]);

  // Mapear tipos de stand a colores
  const typeToColor = {
    basic: "blue",    // Tipo básico - azul
    premium: "red",   // Tipo premium - rojo
    vip: "yellow",    // Tipo VIP - amarillo
  };

  const fetchStands = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await api.get(`/events/${eventId}/stands/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const standsData = response.data.map((stand) => {
        const { position, rotation } = getStandCoordinates(stand.position);
        return {
          id: stand.id,
          position,
          rotation,
          size: [3, 3, 3],
          color: typeToColor[stand.type] || "gray", // Asignar color basado en el tipo o gris por defecto
          pdf: stand.pdf
        };
      });

      setStands(standsData);
      console.log("Stands cargados:", standsData);
    } catch (error) {
      console.error("Error al cargar los stands:", error.response || error);
    }
  };

  const registerVisit = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      await api.post(`/interactions/visits/register/${eventId}/`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Visita registrada.");
    } catch (error) {
      console.error("Error al registrar la entrada:", error.response || error);
    }
  };

  const closeVisit = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await api.post(`/interactions/visits/close/${eventId}/`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(`Visita cerrada. Tiempo total: ${response.data.total_time} segundos`);
    } catch (error) {
      console.error("Error al registrar la salida:", error.response || error);
    }
  };

  useEffect(() => {
    if (eventId && user) {
      registerVisit();
      fetchStands();
    }

    const handleUnload = () => {
      closeVisit();
    };

    window.addEventListener("beforeunload", handleUnload);
    window.addEventListener("pagehide", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
      window.removeEventListener("pagehide", handleUnload);
    };
  }, [eventId, user]);

  const baseConfig = getBasePosition();

  return (
    <>
      {/* Entorno */}
      <Environment
        files="models/textures/kloofendal_48d_partly_cloudy_puresky_1k.hdr" // Ruta al archivo HDR
        background // Si deseas que el HDR también sea el fondo de tu escena
      />
      {/* Simulación física */}
      <Physics>
        {/* Modelo base */}
        <Base position={baseConfig.position} scale={baseConfig.scale} />

        {/* Renderizar stands dinámicamente */}
        {stands.map((stand) => (
          <Stand
            key={stand.id}
            id={stand.id}
            position={stand.position}
            rotation={stand.rotation}
            size={stand.size}
            color={stand.color}
            characterRef={characterRef}
            pdf = {stand.pdf}
          />
        ))}

        {/* Personaje */}
        <CharacterController characterRef={characterRef} />
      </Physics>
    </>
  );
};

export default Experience;