import React, { useRef, useEffect, useState, useContext, useMemo } from "react";
import { Environment } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { CharacterController } from "./CharacterController";
import Stand from "./Stand";
import Base from "./Base";
import api from "../api";
import { AuthContext } from "../contexts/AuthContext";
import { getStandCoordinates } from "../utils/standPositions";
import { getBasePosition } from "../utils/basePosition";
import { CameraManager } from "./CameraManager";
import BoundedArea from "./BoundedArea";
import * as THREE from "three";
import Water from "./WaterShader";
import {Grass} from "./GrassShader";

const Experience = ({ eventId, onStandsLoaded }) => {
  const characterRef = useRef();
  const { user } = useContext(AuthContext);
  const [stands, setStands] = useState([]); // Estado para los stands
  const [isInteracting, setIsInteracting] = useState(false); // Control de interacción
  const [standsLoaded, setStandsLoaded] = useState(false); // Estado de carga finalizada
  const renderDistance = 70; // Distancia máxima para renderizar stands
  const frustum = useMemo(() => new THREE.Frustum(), []);
  const matrix = useMemo(() => new THREE.Matrix4(), []);

  // Función para cargar los stands desde el API
  const fetchStands = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await api.get(`/events/${eventId}/stands/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const fetchedStands = response.data.map((stand) => {
        const { position, rotation, areaRadius } = getStandCoordinates(stand.position);
        return {
          ...stand,
          position,
          rotation,
          areaRadius,
          size: [3, 3, 3],
          visible: true, // Inicialmente visible
        };
      });

      setStands(fetchedStands);
      setStandsLoaded(true); // Indicar que la carga de los stands ha finalizado
      console.log("Stands cargados:", fetchedStands);
    } catch (error) {
      console.error("Error al cargar los stands:", error.response || error);
    }
  };

  // Función para registrar la visita al evento
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

  // Función para cerrar la visita
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

  // Efecto para registrar la visita y cargar los stands
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

  // Llamar a `onStandsLoaded` cuando los stands estén completamente cargados
  useEffect(() => {
    if (standsLoaded && stands.length > 0 && onStandsLoaded) {
      console.log("Stands listos:", stands);
      onStandsLoaded(); // Notificar al componente padre
    }
  }, [standsLoaded, stands, onStandsLoaded]);



  const baseConfig = getBasePosition();

  return (
    <CameraManager>
      {/* Environment */}
      <Environment
        files="models/textures/autumn_field_puresky_1k.hdr"
        background={false}
      />
    <ambientLight intensity={0.1} />
    <directionalLight
  castShadow
  position={[10, 10, 10]}
  intensity={1}
  shadow-mapSize-width={1024}
  shadow-mapSize-height={1024}
  shadow-camera-near={0.5}
  shadow-camera-far={50}
/>




      {/* Physics simulation */}
      <Water position={baseConfig.position} args={[20, 20, 128]} />

      <Physics>
        <Base position={baseConfig.position} scale={baseConfig.scale} castShadow receiveShadow />
        {stands.map((stand) =>
          stand.visible ? (
            <Stand
              key={stand.id}
              id={stand.id}
              position={stand.position}
              rotation={stand.rotation}
              size={stand.size}
              type={stand.type}
              characterRef={characterRef}
              catalog_pdf={stand.catalog_pdf}
              isInteracting={isInteracting}
              setIsInteracting={setIsInteracting}
              url_video={stand.url_video}
              url_web={stand.url_web}
              areaRadius={stand.areaRadius}
              videoRadius={stand.areaRadius + 6}
              company_logo={stand.company_logo}
              company_name = {stand.name}
              receiveShadow castShadow
            />
          ) : null
        )}
        <BoundedArea width={80} depth={85} height={10} position={baseConfig.position} />
        <CharacterController ref={characterRef} isInteracting={isInteracting} />
      </Physics>
    </CameraManager>
  );
};

export default Experience;