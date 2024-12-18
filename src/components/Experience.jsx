// Experience.jsx
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
          color: stand.color || "blue",
        };
      });
      setStands(standsData);
    } catch (error) {
      console.error("Error al cargar los stands:", error.response || error);
    }
  };

  useEffect(() => {
    if (eventId && user) {
      fetchStands();
    }
  }, [eventId, user]);

  const baseConfig = getBasePosition();

  return (
    <>
      <Environment preset="sunset" />

      <Physics >
        <Base position={baseConfig.position} scale={baseConfig.scale} />
        {stands.map((stand) => (
          <Stand
            key={stand.id}
            id={stand.id}
            position={stand.position}
            rotation={stand.rotation}
            size={stand.size}
            color={stand.color}
          />
        ))}
        <CharacterController characterRef={characterRef} />
      </Physics>
    </>
  );
};

export default Experience;
