import React from 'react';
import { Canvas } from '@react-three/fiber';
import { KeyboardControls, Stats } from '@react-three/drei';
import Experience from './Experience';

const keyboardMap = [
  { name: "forward", keys: ["ArrowUp", "KeyW"] },
  { name: "backward", keys: ["ArrowDown", "KeyS"] },
  { name: "left", keys: ["ArrowLeft", "KeyA"] },
  { name: "right", keys: ["ArrowRight", "KeyD"] },
  { name: "run", keys: ["Shift"] },
];

const CanvasWrapper = () => (
  <div className="fullscreen-canvas"> {/* Clase para ocupar toda la pantalla */}
    <KeyboardControls map={keyboardMap}>
      <Canvas
        camera={{ position: [0, 0.5, 5], fov: 42 }}
        style={{
          touchAction: "none",
        }}
      >
        <color attach="background" args={["#f5f3ee"]} />
        <fog attach="fog" args={["#f5f3ee", 10, 50]} />
        <Experience /> {/* Componente que contiene elementos 3D */}
        <Stats />
      </Canvas>
    </KeyboardControls>
  </div>
);

export default CanvasWrapper;
