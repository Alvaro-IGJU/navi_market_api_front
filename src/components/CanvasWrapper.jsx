import React, { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { KeyboardControls } from "@react-three/drei";
import { SoftShadows, BakeShadows } from "@react-three/drei";
import { useLocation } from "react-router-dom";
import Experience from "./Experience";
import LoadingScreen from "./LoadingScreen";
import GradientBackground from "./GradientBackground";

const keyboardMap = [
  { name: "forward", keys: ["ArrowUp", "KeyW"] },
  { name: "backward", keys: ["ArrowDown", "KeyS"] },
  { name: "left", keys: ["ArrowLeft", "KeyA"] },
  { name: "right", keys: ["ArrowRight", "KeyD"] },
  { name: "run", keys: ["Shift"] },
];

const CanvasWrapper = () => {
  const location = useLocation();
  const eventId = location.state?.eventId; // Obtener el eventId del estado de navegación
  const [loading, setLoading] = useState(true); // Estado para manejar el LoadingScreen

  useEffect(() => {
    const header = document.querySelector("header");
    if (header) {
      header.style.display = "none";
    }
  }, []);

  if (!eventId) {
    return <p>No se seleccionó ningún evento.</p>; // Mensaje si no hay evento seleccionado
  }

  return (
    <div className="fullscreen-canvas">
      <LoadingScreen isLoading={loading} />
          
      

      <KeyboardControls map={keyboardMap}>
        <Canvas
          camera={{ position: [0, 0.5, 5], fov: 42 }}
          style={{
            touchAction: "none",
          }}
          shadows
        >
          {/* Fondo degradado */}
          <GradientBackground />
          <Experience
            eventId={eventId}
            onStandsLoaded={() => setLoading(false)} // Ocultar LoadingScreen cuando los stands estén cargados
          />
          <ambientLight intensity={0.3} />
          <directionalLight
            castShadow
            position={[5, 1, 7.5]}
            intensity={1}
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
          />

   
        </Canvas>
      </KeyboardControls>
    </div>
  );
};

export default CanvasWrapper;

