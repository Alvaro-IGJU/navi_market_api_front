import React, { useState, useRef, useEffect } from "react";
import { useGLTF, Html } from "@react-three/drei";

export function Computer({ handleClick, canInteract, isInteracting, position, webUrl, ...props }) {
  const { nodes, materials } = useGLTF("/models/computer.glb");
  const [hoverMessage, setHoverMessage] = useState(null);
  const [clickCooldown, setClickCooldown] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const isHovering = useRef(false);

  const handleComputerClick = () => {
    if (clickCooldown) return;

    handleClick("info_pc");

    // Abre la URL en una nueva ventana o pestaña
    window.open(webUrl, "_blank", "noopener,noreferrer");

    const cooldownTime = 2 * 60; // Cooldown en segundos
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
      isHovering.current = true;
      setMaterialsEmissive("yellow", 0.1);
      document.body.style.cursor = "pointer";

      setHoverMessage(clickCooldown ? `Espera ${countdown}s` : "Abrir web en nueva ventana");
    }
  };

  const handlePointerOut = () => {
    isHovering.current = false;
    setMaterialsEmissive("black", 0);
    document.body.style.cursor = "default";
    setHoverMessage(null);
  };

  useEffect(() => {
    if (!isHovering.current) setHoverMessage(null);

    if (clickCooldown) {
      setHoverMessage(`Espera ${countdown}s`);
    } else if (isHovering.current && canInteract && !isInteracting) {
      setHoverMessage("Abrir web en nueva ventana");
    }
  }, [clickCooldown, countdown, canInteract, isInteracting]);

  return (
    <>
      <group
        {...props}
        position={position}
        onClick={handleComputerClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <group scale={[0.046, 0.001, 0.094]}>
          <mesh geometry={nodes.Cube_1.geometry} material={materials.Material} />
          <mesh geometry={nodes.Cube_2.geometry} material={materials["Material.002"]} />
        </group>
        <group
          position={[-0.073, 0.043, 0]}
          rotation={[0, 0, -1.013]}
          scale={[0.046, 0.001, 0.094]}
        >
          <mesh geometry={nodes.Cube001_1.geometry} material={materials.Material} />
          <mesh geometry={nodes.Cube001_2.geometry} material={materials["Material.001"]} />
        </group>
        <mesh
          geometry={nodes.Cylinder.geometry}
          material={materials["Material.003"]}
          position={[-0.049, 0, 0.003]}
          rotation={[-1.566, 0, 0]}
          scale={[0.003, 0.082, 0.003]}
        />
      </group>

      {/* Mensaje interactivo */}
      {hoverMessage && isHovering.current && canInteract && !isInteracting && (
        <Html position={[position[0], position[1] + 0.35, position[2]]} distanceFactor={3}>
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

export default Computer;

useGLTF.preload("/models/computer.glb");
