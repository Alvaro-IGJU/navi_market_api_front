import React, { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { KeyboardControls, Stats } from '@react-three/drei';
import { useLocation } from 'react-router-dom';
import Experience from './Experience';
import LoadingScreen from './LoadingScreen';

const keyboardMap = [
  { name: "forward", keys: ["ArrowUp", "KeyW"] },
  { name: "backward", keys: ["ArrowDown", "KeyS"] },
  { name: "left", keys: ["ArrowLeft", "KeyA"] },
  { name: "right", keys: ["ArrowRight", "KeyD"] },
  { name: "run", keys: ["Shift"] },
];

const supportsWebGL = () => {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return false;
    if (!gl.getShaderPrecisionFormat) return false; // Check for shader precision format support
    return true;
  } catch (e) {
    return false;
  }
};

const CanvasWrapper = () => {
  const location = useLocation();
  const eventId = location.state?.eventId; // Obtener el eventId del estado de navegación
  
  useEffect(() => {
    const header = document.querySelector("header");
    if (header) {
      header.style.display = "none";
    }
  }, []);

  if (!supportsWebGL()) {
    return <p>Tu dispositivo no soporta WebGL. Intenta actualizar tu navegador o usar otro dispositivo.</p>;
  }

  if (!eventId) {
    return <p>No se seleccionó ningún evento.</p>; // Mensaje si no hay evento seleccionado
  }

  return (
    <div className="fullscreen-canvas"> {/* Clase para ocupar toda la pantalla */}
      <LoadingScreen />

      <KeyboardControls map={keyboardMap}>
        <Canvas
          camera={{ position: [0, 0.5, 5], fov: 42 }}
          style={{
            touchAction: "none",
          }}
          
        >
          <color attach="background" args={["#9bf8ff"]} />
          {/* <fog attach="fog" args={["#f5f3ee", 10, 50]} /> */}
          <Experience eventId={eventId} /> {/* Pasar eventId al componente Experience */}
          {/* <Stats /> */}
        </Canvas>
      </KeyboardControls>
    </div>
  );
};

export default CanvasWrapper;
