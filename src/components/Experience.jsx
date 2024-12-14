import React, { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, useGLTF } from "@react-three/drei";
import { Physics, RigidBody } from "@react-three/rapier";
import { CharacterController } from "./CharacterController";
import Stand from "./Stand";
import Base from "./Base";

const Experience = () => {
  const characterRef = useRef();

  return (
    <>
      {/* Entorno */}
      <Environment preset="sunset" />

      {/* Simulación física */}
      <Physics >
        {/* Modelo base */}
          <Base position={[-3, -2, 2]} scale={[1, 1, 1]}/>

        {/* Stand con contador */}
        <Stand position={[-3, -1, 2]} size={[1, 1, 1]} color="blue" characterRef={characterRef} />
        <Stand position={[4, -1, 2]} size={[1, 1, 1]} color="red" characterRef={characterRef} />

        {/* Personaje */}
        <CharacterController characterRef={characterRef} />
      </Physics>
    </>
  );
};

export default Experience;
