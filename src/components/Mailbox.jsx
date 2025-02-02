import React, { useState, useRef, useEffect } from "react";
import { useGLTF, Html } from "@react-three/drei";

export const Mailbox = React.memo(({ handleClick, canInteract, isInteracting, position, ...props }) => {
  const { nodes, materials } = useGLTF("/models/mailbox.glb"); // Usamos el modelo cargado
  const [hoverMessage, setHoverMessage] = useState(null); // Estado para el mensaje interactivo
  const [clickCooldown, setClickCooldown] = useState(false); // Estado para el cooldown
  const [countdown, setCountdown] = useState(0); // Tiempo restante del cooldown
  const isHovering = useRef(false); // Rastrea si el cursor está sobre el buzón

  const handleMailboxClick = () => {
    if (clickCooldown) return; // Evitar clics si está en cooldown

    handleClick("mailbox"); // Llama a la función pasada como prop

    // Inicia el cooldown
    const cooldownTime = 2 * 60; // Tiempo de enfriamiento en segundos
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

  const setMaterialsEmissive = (color, intensity) => {
    Object.values(materials).forEach((material) => {
      material.emissive.set(color);
      material.emissiveIntensity = intensity;
    });
  };

  const handlePointerOver = () => {
    if (canInteract && !isInteracting) {
      isHovering.current = true; // Marca que el cursor está sobre el modelo
      setMaterialsEmissive("yellow", 0.1); // Cambia todos los materiales a amarillo
      document.body.style.cursor = "pointer";

      // Establece el mensaje interactivo basado en el estado del cooldown
      if (clickCooldown) {
        setHoverMessage(`Espera ${countdown}s`);
      } else {
        setHoverMessage("Solicitar email informativo");
      }
    }
  };

  const handlePointerOut = () => {
    isHovering.current = false; // Marca que el cursor ya no está sobre el modelo
    setMaterialsEmissive("black", 0); // Resetea todos los materiales
    document.body.style.cursor = "default";
    setHoverMessage(null); // Limpia el mensaje interactivo
  };

  useEffect(() => {
    // Limpieza del mensaje si `isHovering` cambia a falso
    if (!isHovering.current) {
      setHoverMessage(null);
    }

    // Actualiza el mensaje durante el cooldown
    if (clickCooldown) {
      setHoverMessage(`Espera ${countdown}s`);
    } else if (isHovering.current && canInteract && !isInteracting) {
      setHoverMessage("Solicitar email informativo");
    }
  }, [clickCooldown, countdown, canInteract, isInteracting]);

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
          <mesh geometry={nodes.Torus.geometry} material={materials["Material.001"]} />
          <mesh geometry={nodes.Torus_1.geometry} material={nodes.Torus_1.material} />
          <mesh geometry={nodes.Torus_2.geometry} material={materials["Material.002"]} />
        </group>
      </group>

      {/* Mostrar el mensaje interactivo si existe */}
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
