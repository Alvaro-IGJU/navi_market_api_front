import React, { useState, useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { Html } from "@react-three/drei";

export function Catalog({ handleClick, canInteract, isInteracting, position,  ...props }) {
  const { nodes } = useGLTF("/models/catalog.glb"); // Usamos el modelo cargado
  const [hoverMessage, setHoverMessage] = useState(null); // Estado para el mensaje interactivo
  const [clickCooldown, setClickCooldown] = useState(false); // Estado para el cooldown
  const [countdown, setCountdown] = useState(0); // Tiempo restante para el cooldown
  const isHovering = useRef(false); // Estado para rastrear si el cursor está sobre el modelo

  const handleCatalogClick = () => {
    if (clickCooldown) return; // Evitar clics si está en cooldown

    handleClick("download_catalog"); // Llama a la función pasada como prop

    // Inicia el cooldown
    const cooldownTime = 60; // Tiempo de enfriamiento en segundos
    setClickCooldown(true);
    setCountdown(cooldownTime);

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setClickCooldown(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Efecto para actualizar `hoverMessage` mientras el temporizador está activo
  useEffect(() => {
    if (clickCooldown && isHovering.current) {
      setHoverMessage(`Espera ${countdown}s`);
    } else if (!clickCooldown && isHovering.current) {
      setHoverMessage("Descargar Catálogo");
    }
  }, [clickCooldown, countdown]);

  const handlePointerOver = (e) => {
    if (canInteract && !isInteracting) {
      isHovering.current = true; // Marca que el cursor está sobre el modelo
      e.stopPropagation(); // Evita que el evento se propague
      e.object.material.emissive.set("yellow"); // Añade brillo amarillo
      e.object.material.emissiveIntensity = 0.2; // Ajusta la intensidad
      document.body.style.cursor = "pointer";

      // Establece el mensaje basado en el estado del cooldown
      setHoverMessage(clickCooldown ? `Espera ${countdown}s` : "Descargar Catálogo");
    }
  };

  const handlePointerOut = (e) => {
    isHovering.current = false; // Marca que el cursor ya no está sobre el modelo
    e.stopPropagation(); // Evita que el evento se propague
    e.object.material.emissive.set("black"); // Elimina el brillo
    e.object.material.emissiveIntensity = 0;
    document.body.style.cursor = "default";

    // Limpia el mensaje interactivo
    setHoverMessage(null);
  };

  return (
    <RigidBody type="fixed">
      <group
        {...props}
        onClick={handleCatalogClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        dispose={null} // Limpieza automática
        position={position}
      >
        <mesh
          geometry={nodes.CATALOGO.geometry} // Geometría del modelo
          material={nodes.CATALOGO.material} // Material del modelo
          position={[0, 0.461, -0.147]} // Posición ajustada
          rotation={[-0.121, 0, 0]} // Rotación ajustada
          scale={[0.974, 0.426, 0.009]} // Escala ajustada
        />
        {hoverMessage && isHovering.current && canInteract && !isInteracting && (
          <Html position={[position[0], position[1] + 2, position[2]]} distanceFactor={2}>
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
