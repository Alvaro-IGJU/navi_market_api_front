import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useGLTF, Html } from "@react-three/drei";

export const Mailbox = React.memo(({ handleClick, canInteract, isInteracting, position, ...props }) => {
  const { nodes, materials } = useGLTF("/models/mailbox.glb"); // Cargar el modelo
  const [hoverMessage, setHoverMessage] = useState(null); // Mensaje interactivo
  const clickCooldown = useRef(false); // Usar `useRef` para evitar re-renderizados
  const countdown = useRef(0); // Usar `useRef` para evitar re-renderizados
  const isHovering = useRef(false); // Usar `useRef` para el estado del cursor

  // Memorizar los materiales y geometrías del modelo GLTF para evitar recargas innecesarias
  const gltfModel = useMemo(() => ({ nodes, materials }), [nodes, materials]);

  // Función optimizada para manejar el clic en el buzón
  const handleMailboxClick = useCallback(() => {
    if (clickCooldown.current) return;

    handleClick("mailbox");

    // Iniciar el cooldown
    const cooldownTime = 2 * 60; // Cooldown de 2 minutos
    clickCooldown.current = true;
    countdown.current = cooldownTime;

    const interval = setInterval(() => {
      countdown.current -= 1;
      if (countdown.current <= 1) {
        clearInterval(interval);
        clickCooldown.current = false;
      }
    }, 1000);
  }, [handleClick]);

  // Cambiar los materiales emisivos del buzón
  const setMaterialsEmissive = (color, intensity) => {
    Object.values(gltfModel.materials).forEach((material) => {
      material.emissive.set(color);
      material.emissiveIntensity = intensity;
    });
  };

  // Manejo del puntero sobre el objeto
  const handlePointerOver = useCallback(() => {
    if (canInteract && !isInteracting) {
      isHovering.current = true;
      setMaterialsEmissive("yellow", 0.1);
      document.body.style.cursor = "pointer";
      setHoverMessage(clickCooldown.current ? `Espera ${countdown.current}s` : "Solicitar email informativo");
    }
  }, [canInteract, isInteracting]);

  // Manejo del puntero fuera del objeto
  const handlePointerOut = useCallback(() => {
    isHovering.current = false;
    setMaterialsEmissive("black", 0);
    document.body.style.cursor = "default";
    setHoverMessage(null);
  }, []);

  // Efecto para actualizar el mensaje interactivo y el cooldown
  useEffect(() => {
    if (!isHovering.current) setHoverMessage(null);
    if (clickCooldown.current) {
      setHoverMessage(`Espera ${countdown.current}s`);
    } else if (isHovering.current && canInteract && !isInteracting) {
      setHoverMessage("Solicitar email informativo");
    }
  }, [clickCooldown.current, countdown.current, canInteract, isInteracting]);

  return (
    <>
      <group
        {...props}
        position={position}
        onClick={handleMailboxClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <group position={[0, 5.649, 0]} rotation={[1.567, 0, 0]} scale={[0.156, 0.089, 0.156]}>
          <mesh geometry={gltfModel.nodes.Torus.geometry} material={gltfModel.materials["Material.001"]} />
          <mesh geometry={gltfModel.nodes.Torus_1.geometry} material={gltfModel.nodes.Torus_1.material} />
          <mesh geometry={gltfModel.nodes.Torus_2.geometry} material={gltfModel.materials["Material.002"]} />
        </group>
      </group>

      {/* Mostrar el mensaje interactivo si es necesario */}
      {hoverMessage && isHovering.current && canInteract && !isInteracting && (
        <Html position={[position[0], position[1] + 0.75, position[2]]} distanceFactor={3}>
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
});

export default Mailbox;

useGLTF.preload("/models/mailbox.glb");
