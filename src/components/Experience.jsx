import React, { useRef, useEffect, useState, useContext } from "react";
import { Environment } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { CharacterController } from "./CharacterController";
import Stand from "./Stand";
import Base from "./Base";
import api from "../api";
import { AuthContext } from "../contexts/AuthContext";
import { getStandCoordinates } from "../utils/standPositions"; // Archivo para coordenadas de stands
import { getBasePosition } from "../utils/basePosition"; // Archivo para coordenadas de la base

const Experience = () => {
  const characterRef = useRef();
  const { user } = useContext(AuthContext);
  const [stands, setStands] = useState([]);

  const eventId = 1;

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
          size: [1, 1, 1],
          color: stand.color || "blue",
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
    if (user) {
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
  }, [user]);

  // Obtener posición y escala de la base desde el archivo de configuración
  const baseConfig = getBasePosition();

  return (
    <>
      {/* Entorno */}
      <Environment preset="sunset" />

      {/* Simulación física */}
      <Physics debug>
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
          />
        ))}


        {/* Personaje */}
        <CharacterController characterRef={characterRef} />
      </Physics>
    </>
  );
};

export default Experience;
