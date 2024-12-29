import React, { useState } from "react";
import { useGLTF } from "@react-three/drei";
import { Html } from "@react-three/drei";

export function Mailbox({ handleClick, canInteract, isInteracting, ...props }) {
  const { nodes } = useGLTF("/models/mailbox.glb"); // Usamos el modelo cargado
  const [hoverMessage, setHoverMessage] = useState(null); // Estado interno para el mensaje interactivo

  return (
    <>
      <group
        {...props}
        onClick={() => handleClick("mailbox")}
        onPointerOver={(e) => {
          if (canInteract) {
            if (canInteract && !isInteracting) {

            e.object.material.emissive.set("yellow"); // Añade brillo amarillo
            e.object.material.emissiveIntensity = 0.1; // Ajusta la intensidad
            document.body.style.cursor = "pointer";
            setHoverMessage("Abrir buzón"); // Establece el mensaje interactivo
            }
          }
        }}
        onPointerOut={(e) => {
          e.object.material.emissive.set("black"); // Elimina el brillo
          e.object.material.emissiveIntensity = 0;
          document.body.style.cursor = "default";
          setHoverMessage(null); // Limpia el mensaje interactivo
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

      {/* Mostrar el mensaje interactivo si existe */}
      {hoverMessage && canInteract && !isInteracting && (
        <Html position={[0.6, -0.25, -1.3]} distanceFactor={3}>
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
    </>
  );
}

export default Mailbox;

useGLTF.preload("/models/mailbox.glb");
