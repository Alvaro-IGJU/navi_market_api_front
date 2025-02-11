import React, { useEffect, useRef, useLayoutEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, KeyboardControls, BakeShadows, ContactShadows } from "@react-three/drei";
import { useLocation } from "react-router-dom";
import Lobby from "./Lobby2";
import { Physics } from "@react-three/rapier";
import { CharacterController } from "./CharacterController";
import { CameraManager } from "./CameraManager";
import UpwardSpotLight from "./UpwardSpotLight";
import Portal from "./Portal";
import api from "../api";
import LoadingScreen from "./LoadingScreen";

const keyboardMap = [
  { name: "forward", keys: ["ArrowUp", "KeyW"] },
  { name: "backward", keys: ["ArrowDown", "KeyS"] },
  { name: "left", keys: ["ArrowLeft", "KeyA"] },
  { name: "right", keys: ["ArrowRight", "KeyD"] },
  { name: "run", keys: ["Shift"] },
];

const CanvasWrapper = () => {
  const location = useLocation();
  // Si se pasa un eventId por location.state se usa, sino se iniciará en null
  const initialEventId = 0;
  const [eventId, setEventId] = useState(0);
  const [loading, setLoading] = useState(true);
  const characterRef = useRef();

  useEffect(() => {
    const header = document.querySelector("header");
    if (header) header.style.display = "none";
  }, []);

  useEffect(() => {
    // Si ya tenemos eventId (por ejemplo, pasado por location) no hacemos el fetch
    if (eventId) return;

    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await api.get("/events/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Suponemos que response.data es un array de eventos y que cada evento tiene una propiedad "id"
        if (response.data && response.data.length > 0) {
          setEventId(response.data[0].id);
        }
      } catch (err) {
        console.error("Error al obtener los eventos:", err);
      }
    };

    fetchEvents();
  }, [eventId]);

  

  return (
    <div className="fullscreen-canvas">
      <LoadingScreen isLoading={false}/>

      <KeyboardControls map={keyboardMap}>
        <Canvas
          camera={{ position: [0, 0.5, 5], fov: 42 }}
          style={{ touchAction: "none" }}
          shadows
          gl={{ antialias: true }}
        >
          <CameraManager>
            <Environment preset="apartment" intensity={1} />
            <Physics>
              <directionalLight
                position={[-1, 2, 6]}
                intensity={1}
                castShadow
                shadow-mapSize-width={4096}
                shadow-mapSize-height={4096}
                shadow-camera-near={0.1}
                shadow-camera-far={50}
                shadow-camera-left={-50}
                shadow-camera-right={50}
                shadow-camera-top={50}
                shadow-camera-bottom={-50}
                shadow-bias={-0.0005}
              />
              <UpwardSpotLight
                position={[13.2, -0.4, -1.5]}
                targetPosition={[0, 200, 0]}
                intensity={2}
              />
              <group>
                <Lobby position={[0, 0, 0]} />
                <Portal
                  position={[-17.5, 1.2, 2.58]}
                  rotation={[0, Math.PI / 2, 0]}
                  characterRef={characterRef}
                  eventId={eventId}
                />
              </group>
              <CharacterController ref={characterRef} eventId={0} />
              <ContactShadows
                position={[0, -0.1, 0]}
                opacity={0.5}
                scale={10}
                blur={1.5}
                far={10}
              />
            </Physics>
          </CameraManager>
        </Canvas>
      </KeyboardControls>
    </div>
  );
};

export default CanvasWrapper;
