import React from "react";
import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";

export function StandBronce(props) {
  const { nodes, materials } = useGLTF("/models/stand_bronce.glb");
  return (
    <RigidBody type="fixed" {...props}> {/* Añadimos RigidBody alrededor del grupo */}
      <group dispose={null}>
        <mesh
          geometry={nodes.ESTRUCTURA_PRINCIPAL.geometry}
          material={materials.Material}
          position={[0, 7.778, 0]}
          scale={[3.056, 7.666, 3.056]}
        />
        <mesh
          geometry={nodes.ESTANTERIA.geometry}
          material={nodes.ESTANTERIA.material}
          position={[0.045, 8.219, 2.528]}
          scale={[1.687, 2.745, 0.422]}
        />
        <mesh
          geometry={nodes.MECANISMO_EMGRANAJE.geometry}
          material={nodes.MECANISMO_EMGRANAJE.material}
          position={[0, 0.235, 0]}
          scale={[11.412, 0.844, 11.412]}
        />
      </group>
    </RigidBody>
  );
}

export default StandBronce;
useGLTF.preload("/models/stand_bronce.glb");
