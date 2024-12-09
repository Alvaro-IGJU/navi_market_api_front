import React, { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { Physics, RigidBody } from "@react-three/rapier";
import { CharacterController } from "./CharacterController";
import Stand from "./Stand";

const Experience = () => {
  const characterRef = useRef();

  return (
    <>
      {/* Entorno */}
      <Environment preset="sunset" />

      {/* Simulación física */}
      <Physics debug>
        {/* Suelo */}
        <RigidBody type="fixed">
          <mesh position={[0, -1, 0]}>
            <boxGeometry args={[10, 1, 10]} />
            <meshStandardMaterial color="gray" />
          </mesh>
        </RigidBody>

        {/* Stand con contador */}
        <Stand position={[-3, 0, 2]} size={[1, 1, 1]} color="blue" characterRef={characterRef} />
        <Stand position={[4, 0, 2]} size={[1, 1, 1]} color="red" characterRef={characterRef} />

        {/* Personaje */}
        <CharacterController characterRef={characterRef} />
      </Physics>
    </>
  );
};

export default Experience;
