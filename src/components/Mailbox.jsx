import React from "react";
import { RigidBody } from "@react-three/rapier";
import { useGLTF } from "@react-three/drei";

export function Mailbox({ handleClick, canInteract, ...props }) {
  const { nodes } = useGLTF("/models/mailbox.glb"); // Usamos el modelo cargado

  return (
      <group
        {...props}
        onClick={() => handleClick("mailbox")}
        onPointerOver={(e) => {
          if (canInteract) {
            e.object.material.emissive.set("yellow"); // Añade brillo amarillo
            e.object.material.emissiveIntensity = 0.1; // Ajusta la intensidad
            document.body.style.cursor = "pointer";
          }
        }}
        onPointerOut={(e) => {
          e.object.material.emissive.set("black"); // Elimina el brillo
          e.object.material.emissiveIntensity = 0;
          document.body.style.cursor = "default";
        }}
      >
        <mesh
          geometry={nodes.BUZON.geometry} // Geometría del buzón
          material={nodes.BUZON.material} // Material del buzón
          position={[0, 5.649, 0]}
          rotation={[1.567, 0, 0]}
          scale={[0.156, 0.089, 0.156]}
        />
      </group>
  );
}

export default Mailbox;

useGLTF.preload("/models/mailbox.glb");
