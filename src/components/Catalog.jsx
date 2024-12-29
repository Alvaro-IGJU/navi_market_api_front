import React, { useState } from "react";
import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { Html } from "@react-three/drei";

export function Catalog({ handleClick, canInteract, isInteracting, ...props }) {
  const { nodes, materials } = useGLTF("/models/catalog.glb"); // Usamos el modelo cargado
  const [hoverMessage, setHoverMessage] = useState(null); // Estado para el mensaje interactivo

  return (
    <RigidBody type="fixed">
      <group
        {...props}
        onClick={() => handleClick("download_catalog")}
        onPointerOver={(e) => {
          if (canInteract && !isInteracting) {
            e.stopPropagation(); // Evita que el evento se propague
            e.object.material.emissive.set("yellow"); // Añade brillo amarillo
            e.object.material.emissiveIntensity = 0.2; // Ajusta la intensidad
            document.body.style.cursor = "pointer";
            setHoverMessage("Descargar Catálogo"); // Establece el mensaje
          }
        }}
        onPointerOut={(e) => {
          e.stopPropagation(); // Evita que el evento se propague
          e.object.material.emissive.set("black"); // Elimina el brillo
          e.object.material.emissiveIntensity = 0;
          document.body.style.cursor = "default";
          setHoverMessage(null); // Limpia el mensaje
        }}
        dispose={null} // Limpieza automática
      >
        <mesh
          geometry={nodes.CATALOGO.geometry} // Geometría del modelo
          material={nodes.CATALOGO.material} // Material del modelo
          position={[0, 0.461, -0.147]} // Posición ajustada
          rotation={[-0.121, 0, 0]} // Rotación ajustada
          scale={[0.974, 0.426, 0.009]} // Escala ajustada
        />
        {hoverMessage && canInteract && !isInteracting && (
          <Html position={[0, 2, 0]} distanceFactor={3}>
            <div
              style={{
                background: "rgba(0, 0, 0, 0.75)",
                color: "white",
                padding: "5px 10px",
                borderRadius: "5px",
                fontSize: "12px",
                textAlign: "center",
                whiteSpace: "nowrap",
              }}
            >
              {hoverMessage}
            </div>
          </Html>
        )}
      </group>
    </RigidBody>
  );
}

export default Catalog;

useGLTF.preload("/models/catalog.glb");
