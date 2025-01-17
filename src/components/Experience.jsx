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
import { CameraManager } from "./CameraManager";
import { Water } from "./Water";

const Experience = ({ eventId }) => {
  const characterRef = useRef();
  const { user } = useContext(AuthContext);
  const [stands, setStands] = useState([]);
  const [isInteracting, setIsInteracting] = useState(false); // Estado para controlar interacción

  // Fetching stands from API
  const fetchStands = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await api.get(`/events/${eventId}/stands/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const standsData = response.data.map((stand) => {
        const { position, rotation, areaRadius } = getStandCoordinates(stand.position);
        return {
          id: stand.id,
          position,
          rotation,
          areaRadius,
          size: [3, 3, 3],
          type: stand.type,
          catalog_pdf: stand.catalog_pdf,
          url_video: stand.url_video,
          url_web: stand.url_web,
        };
      });

      setStands(standsData);
      console.log("Stands cargados:", standsData);
    } catch (error) {
      console.error("Error al cargar los stands:", error.response || error);
    }
  };

  // Register visit to the event
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

  // Close visit when leaving the event
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

  // Register the visit and fetch stands on mount
  useEffect(() => {
    if (eventId && user) {
      registerVisit();
      fetchStands();
    }

    // Handle cleanup on page unload or hide
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
    <CameraManager>
      {/* Environment */}
      <Environment
        files="models/textures/autumn_field_puresky_1k.hdr"
        background={false}
      />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1} 
        castShadow 
      />

      {/* Physics simulation */}
      <Physics >
        {/* Base model */}
        <Base position={baseConfig.position} scale={baseConfig.scale} />
        <Water rotation-x={-Math.PI / 2}  position={[-50, -20, 0]} position-y={-20} />
        {/* Render stands dynamically */}
        {stands.map((stand) => (
          <Stand
            key={stand.id}
            id={stand.id}
            position={stand.position}
            rotation={stand.rotation}
            size={stand.size}
            type={stand.type}
            characterRef={characterRef} // Pass characterRef
            catalog_pdf={stand.catalog_pdf}
            isInteracting={isInteracting} // Pass isInteracting
            setIsInteracting={setIsInteracting} // Pass setIsInteracting
            url_video={stand.url_video}
            url_web={stand.url_web}
            areaRadius={stand.areaRadius}
          />
        ))}

        {/* Character controller */}
        <CharacterController ref={characterRef} isInteracting={isInteracting} />
      </Physics>
    </CameraManager>
  );
};

export default Experience;
