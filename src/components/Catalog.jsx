import React from "react";
import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";

export function Catalog({ handleClick, canInteract, ...props }) {
  const { scene } = useGLTF("/models/catalog.glb"); // Usamos el objeto 'scene'

  return (
    <RigidBody type="fixed">
      <primitive
        object={scene} // Pasamos la escena completa del modelo GLTF
        {...props}
        onClick={() => handleClick("download_catalog")}
        onPointerOver={(e) => {
          if (canInteract) {
            e.stopPropagation(); // Evita que el evento se propague
            document.body.style.cursor = "pointer";
          }
        }}
        onPointerOut={(e) => {
          e.stopPropagation(); // Evita que el evento se propague
          document.body.style.cursor = "default";
        }}
        dispose={null} // Limpieza automática
      />
    </RigidBody>
  );
}

export default Catalog;

useGLTF.preload("/models/catalog.glb");
