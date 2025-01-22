import React, { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { KeyboardControls } from "@react-three/drei";
import { useLocation } from "react-router-dom";
import Experience from "./Experience";
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
      {/* Pasar el estado `loading` a LoadingScreen */}
      <LoadingScreen isLoading={loading} />

      <KeyboardControls map={keyboardMap}>
        <Canvas
          camera={{ position: [0, 0.5, 5], fov: 42 }}
          style={{
            touchAction: "none",
          }}
        >
          <color attach="background" args={["#9bf8ff"]} />
          <Experience
            eventId={eventId}
            onStandsLoaded={() => setLoading(false)} // Ocultar LoadingScreen cuando los stands estén cargados
          />
        </Canvas>
      </KeyboardControls>
    </div>
  );
};

export default CanvasWrapper;
