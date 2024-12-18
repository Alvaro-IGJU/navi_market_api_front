import React from 'react';
import { Canvas } from '@react-three/fiber';
import { KeyboardControls, Stats } from '@react-three/drei';
import { useLocation } from 'react-router-dom';
import Experience from './Experience';

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

  if (!eventId) {
    return <p>No se seleccionó ningún evento.</p>; // Mensaje si no hay evento seleccionado
  }

  return (
    <div className="fullscreen-canvas"> {/* Clase para ocupar toda la pantalla */}
      <KeyboardControls map={keyboardMap}>
        <Canvas
          camera={{ position: [0, 0.5, 5], fov: 42 }}
          style={{
            touchAction: "none",
          }}
        >
          <color attach="background" args={["#f5f3ee"]} />
          {/* <fog attach="fog" args={["#f5f3ee", 10, 50]} /> */}
          <Experience eventId={eventId} /> {/* Pasar eventId al componente Experience */}
          <Stats />
        </Canvas>
      </KeyboardControls>
    </div>
  );
};

export default CanvasWrapper;
