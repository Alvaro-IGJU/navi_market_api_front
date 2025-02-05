import React, { useState, useRef, useEffect, useMemo } from "react";
import { useGLTF, Html } from "@react-three/drei";

const Computer = React.memo(({ handleClick, canInteract, isInteracting, position, webUrl, ...props }) => {
  const { nodes, materials } = useGLTF("/models/computer.glb");
  const [hoverMessage, setHoverMessage] = useState(null);
  const clickCooldown = useRef(false); // Usamos useRef para evitar renders innecesarios
  const countdown = useRef(0); // Usamos useRef para evitar renders innecesarios
  const isHovering = useRef(false);

  // Memorizamos el modelo GLTF para no cargarlo de nuevo en cada renderizado
  const gltfModel = useMemo(() => {
    return { nodes, materials };
  }, [nodes, materials]);

  const handleComputerClick = () => {
    if (clickCooldown.current) return;

    handleClick("info_pc");
    window.open(webUrl, "_blank", "noopener,noreferrer");

    // Configuración de cooldown con useRef
    const cooldownTime = 2 * 60;
    clickCooldown.current = true;
    countdown.current = cooldownTime;

    const interval = setInterval(() => {
      if (countdown.current <= 1) {
        clearInterval(interval);
        clickCooldown.current = false;
      } else {
        countdown.current -= 1;
      }
      setHoverMessage(`Espera ${countdown.current}s`);
    }, 1000);
  };

  const setMaterialsEmissive = (color, intensity) => {
    Object.values(gltfModel.materials).forEach((material) => {
      material.emissive.set(color);
      material.emissiveIntensity = intensity;
    });
  };

  const handlePointerOver = () => {
    if (canInteract && !isInteracting) {
      isHovering.current = true;
      setMaterialsEmissive("yellow", 0.1);
      document.body.style.cursor = "pointer";
      setHoverMessage(clickCooldown.current ? `Espera ${countdown.current}s` : "Abrir web en nueva ventana");
    }
  };

  const handlePointerOut = () => {
    isHovering.current = false;
    setMaterialsEmissive("black", 0);
    document.body.style.cursor = "default";
    setHoverMessage(null);
  };

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
          <mesh geometry={gltfModel.nodes.Cube_1.geometry} material={gltfModel.materials.Material} />
          <mesh geometry={gltfModel.nodes.Cube_2.geometry} material={gltfModel.materials["Material.002"]} />
        </group>
        <group position={[-0.073, 0.043, 0]} rotation={[0, 0, -1.013]} scale={[0.046, 0.001, 0.094]}>
          <mesh geometry={gltfModel.nodes.Cube001_1.geometry} material={gltfModel.materials.Material} />
          <mesh geometry={gltfModel.nodes.Cube001_2.geometry} material={gltfModel.materials["Material.001"]} />
        </group>
        <mesh
          geometry={gltfModel.nodes.Cylinder.geometry}
          material={gltfModel.materials["Material.003"]}
          position={[-0.049, 0, 0.003]}
          rotation={[-1.566, 0, 0]}
          scale={[0.003, 0.082, 0.003]}
        />
      </group>

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
});

export default Computer;

useGLTF.preload("/models/computer.glb");
