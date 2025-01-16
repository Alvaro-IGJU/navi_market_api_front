import React, { useState, useRef, useEffect } from "react";
import { useGLTF, Html } from "@react-three/drei";

export function Phone({ handleClick, canInteract, isInteracting, setIsInteracting, position, rotation, scale, ...props }) {
  const { nodes, materials } = useGLTF("/models/phone.glb");
  const [hoverMessage, setHoverMessage] = useState(null);
  const [clickCooldown, setClickCooldown] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const isHovering = useRef(false);

  const handlePhoneClick = () => {
    if (clickCooldown || !canInteract || isInteracting) return;

    handleClick("schedule_meeting");
    // setIsInteracting(true);

    const cooldownTime = 2 * 60; // Cooldown en segundos
    setClickCooldown(true);
    setCountdown(cooldownTime);

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setClickCooldown(false);
          setIsInteracting(false);
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

      setHoverMessage(clickCooldown ? `Espera ${countdown}s` : "Agendar reunión");
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
      setHoverMessage("Interactuar con el teléfono");
    }
  }, [clickCooldown, countdown, canInteract, isInteracting]);

  return (
    <>
      <group
        {...props}
        position={position}
        rotation={rotation}
        scale={scale}
        onClick={handlePhoneClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <mesh geometry={nodes.Cube.geometry} material={materials.Material} rotation={[-Math.PI, 0, -Math.PI]} scale={[-1.31, -0.289, -1.95]} />
        <mesh geometry={nodes.Cylinder.geometry} material={materials["Material.002"]} position={[0, -0.149, -0.712]} scale={0.271} />
        <mesh geometry={nodes.Cylinder001.geometry} material={materials["Material.001"]} position={[0, -0.172, 0.58]} scale={0.286} />
        <mesh geometry={nodes.Phone.geometry} material={materials.Material__2} position={[0, 0.724, -0.061]} rotation={[Math.PI / 2, 0, 1.59]} scale={[-0.01, -0.011, -0.011]} />
      </group>

      {/* Mensaje interactivo */}
      {hoverMessage && isHovering.current && canInteract && !isInteracting && (
        <Html position={[position[0], position[1] + 0.5, position[2]]} distanceFactor={3}>
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

export default Phone;

useGLTF.preload("/models/phone.glb");
