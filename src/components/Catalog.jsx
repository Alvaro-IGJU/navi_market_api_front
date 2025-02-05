import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useGLTF, Html, PerspectiveCamera } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";

export const Catalog = React.memo(({
  handleClick,
  canInteract,
  isInteracting,
  position,
  catalogBase64,
  setIsInteracting,
  ...props
}) => {
  const { nodes, materials } = useGLTF("/models/catalog.glb");
  const [hoverMessage, setHoverMessage] = useState(null);
  const downloadCooldown = useRef(false); // Usamos useRef para evitar renders innecesarios
  const countdown = useRef(0);
  const [showPDF, setShowPDF] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 300, height: 280 });
  const cameraRef = useRef();
  const isHovering = useRef(false);

  // Memorizar el modelo GLTF para evitar recargas innecesarias
  const gltfModel = useMemo(() => ({ nodes, materials }), [nodes, materials]);

  // Calcular dimensiones dinámicas solo cuando el tamaño de la ventana cambie
  useEffect(() => {
    const calculateDimensions = () => {
      const widthMultiplier = window.innerWidth <= 768 ? 0.4 : window.innerWidth <= 1024 ? 0.7 : 0.6;
      const heightMultiplier = window.innerWidth <= 768 ? 0.3 : window.innerWidth <= 1024 ? 0.6 : 0.3;
      const maxWidth = window.innerWidth * widthMultiplier;
      const maxHeight = window.innerHeight * heightMultiplier;
      const width = Math.min(maxWidth, 400);
      const height = Math.min(maxHeight, 500);
      setDimensions({ width, height });
    };

    calculateDimensions();
    window.addEventListener("resize", calculateDimensions);
    return () => window.removeEventListener("resize", calculateDimensions);
  }, []);

  // Función optimizada para manejar el click en el catálogo
  const handleCatalogClick = useCallback(() => {
    setShowPDF(true);
    setIsInteracting(true);
  }, [setIsInteracting]);

  // Optimizar el manejo del puntero sobre el objeto
  const handlePointerOver = useCallback((e) => {
    if (canInteract && !isInteracting && e.object?.material?.emissive) {
      isHovering.current = true;
      e.object.material.emissive.set("yellow");
      e.object.material.emissiveIntensity = 0.2;
      document.body.style.cursor = "pointer";
      setHoverMessage("Ver Catálogo");
    }
  }, [canInteract, isInteracting]);

  const handlePointerOut = useCallback((e) => {
    if (e.object?.material?.emissive) {
      e.object.material.emissive.set("black");
      e.object.material.emissiveIntensity = 0;
    }
    isHovering.current = false;
    document.body.style.cursor = "default";
    setHoverMessage(null);
  }, []);

  // Función para cerrar el PDF
  const handleClosePDF = () => {
    setShowPDF(false);
    setIsInteracting(false);
  };

  // Función optimizada para descargar el PDF
  const handleDownloadPDF = useCallback(() => {
    if (downloadCooldown.current) return;

    downloadCooldown.current = true;
    const cooldownTime = 60;
    countdown.current = cooldownTime;

    const interval = setInterval(() => {
      countdown.current -= 1;
      if (countdown.current <= 1) {
        clearInterval(interval);
        downloadCooldown.current = false;
      }
    }, 1000);

    // Descargar el PDF
    const link = document.createElement("a");
    const byteCharacters = atob(catalogBase64);
    const byteNumbers = new Uint8Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const blob = new Blob([byteNumbers], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = "catalog.pdf";
    link.click();
    URL.revokeObjectURL(url);
    handleClick("download_catalog");
  }, [catalogBase64, handleClick]);

  return (
    <>
      <RigidBody type="fixed">
        <group
          {...props}
          position={position}
          onClick={handleCatalogClick}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
          dispose={null}
        >
          <group scale={[1.747, 2.296, 0.069]}>
            <mesh geometry={gltfModel.nodes.Cube_1.geometry} material={gltfModel.materials["Material.001"]} />
            <mesh geometry={gltfModel.nodes.Cube_2.geometry} material={gltfModel.materials["Material.002"]} />
          </group>
          <mesh
            geometry={gltfModel.nodes.Plane.geometry}
            material={gltfModel.nodes.Plane.material}
            position={[0, -0.239, 0.238]}
            rotation={[Math.PI / 2, 0, 0]}
            scale={[1.373, 1, 1.641]}
          />
          <mesh
            geometry={gltfModel.nodes.Text.geometry}
            material={gltfModel.materials.gradiente}
            position={[-1.507, 1.54, 0.089]}
            rotation={[1.533, 0, 0]}
            scale={0.644}
          />
          <mesh
            geometry={gltfModel.nodes.Text001.geometry}
            material={gltfModel.materials.Material}
            position={[0.043, 0.086, 0.245]}
            rotation={[1.602, 0, 0]}
            scale={0.267}
          />
          {hoverMessage && isHovering.current && canInteract && !isInteracting && (
            <Html position={[position[0], position[1] + 3.5, position[2]]} distanceFactor={2}>
              <div
                style={{
                  background: "rgba(0, 0, 0, 0.75)",
                  color: "white",
                  padding: "5px 10px",
                  borderRadius: "5px",
                  fontSize: "20px",
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

      {showPDF && (
        <>
          <PerspectiveCamera
            ref={cameraRef}
            makeDefault
            position={[0, 0.5, 10]}
            fov={50}
          />
          <Html position={[0, 0.4, 0]} transform>
            <div
              style={{
                width: `${dimensions.width}px`,
                height: `${dimensions.height}px`,
                background: "white",
                borderRadius: "10px",
                overflow: "hidden",
                boxShadow: "0px 4px 20px rgba(0,0,0,0.3)",
              }}
            >
              <button
                onClick={handleClosePDF}
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  backgroundColor: "red",
                  color: "white",
                  border: "none",
                  borderRadius: "50%",
                  width: "30px",
                  height: "30px",
                  cursor: "pointer",
                  zIndex: 1,
                }}
              >
                X
              </button>
              <button
                onClick={handleDownloadPDF}
                style={{
                  position: "absolute",
                  bottom: "10px",
                  left: "10px",
                  backgroundColor: downloadCooldown
                    ? "rgba(199, 170, 104, 0.5)"
                    : "rgb(199, 170, 104)",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  padding: "5px 10px",
                  cursor: downloadCooldown ? "not-allowed" : "pointer",
                  zIndex: 1,
                }}
              >
                {downloadCooldown ? `Espera ${countdown.current}s` : "Descargar"}
              </button>
              <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
                <Viewer
                  fileUrl={`data:application/pdf;base64,${catalogBase64}`}
                  style={{ height: "100%", width: "100%" }}
                />
              </Worker>
            </div>
          </Html>
        </>
      )}
    </>
  );
});

export default Catalog;
useGLTF.preload("/models/catalog.glb");
