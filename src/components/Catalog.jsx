import React, { useState, useEffect, useRef } from "react";
import { useGLTF, Html, PerspectiveCamera } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";

export function Catalog({
  handleClick,
  canInteract,
  isInteracting,
  position,
  catalogBase64, // Base64 del PDF
  setIsInteracting, // Controlar la interacción global
  ...props
}) {
  const { nodes } = useGLTF("/models/catalog.glb");
  const [hoverMessage, setHoverMessage] = useState(null);
  const [downloadCooldown, setDownloadCooldown] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [showPDF, setShowPDF] = useState(false); // Controla si el PDF se muestra
  const cameraRef = useRef(); // Referencia para la cámara
  const isHovering = useRef(false);

  const handleCatalogClick = () => {
    handleClick("view_catalog"); // Notificar la acción
    setShowPDF(true); // Mostrar el PDF
    setIsInteracting(true); // Indicar que se está interactuando
  };

  const handlePointerOver = (e) => {
    if (canInteract && !isInteracting) {
      isHovering.current = true;
      e.object.material.emissive.set("yellow"); // Resaltar con amarillo
      e.object.material.emissiveIntensity = 0.2;
      document.body.style.cursor = "pointer";
      setHoverMessage("Ver Catálogo");
    }
  };

  const handlePointerOut = (e) => {
    isHovering.current = false;
    e.object.material.emissive.set("black"); // Restaurar el color
    e.object.material.emissiveIntensity = 0;
    document.body.style.cursor = "default";
    setHoverMessage(null);
  };

  const handleClosePDF = () => {
    setShowPDF(false); // Cerrar el PDF
    setIsInteracting(false); // Dejar de interactuar
  };

  const handleDownloadPDF = () => {
    if (downloadCooldown) return;

    // Inicia el cooldown
    setDownloadCooldown(true);
    const cooldownTime = 60; // Cooldown en segundos
    setCountdown(cooldownTime);

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setDownloadCooldown(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Descargar el PDF
    const link = document.createElement("a");
    const byteCharacters = atob(catalogBase64);
    const byteNumbers = new Uint8Array(byteCharacters.length).map((_, i) =>
      byteCharacters.charCodeAt(i)
    );
    const blob = new Blob([byteNumbers], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = "catalog.pdf";
    link.click();
    URL.revokeObjectURL(url); // Liberar memoria
  };

  return (
    <>
      <RigidBody type="fixed">
        <group
          {...props}
          position={position}
          onClick={handleCatalogClick}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        >
          <mesh
            geometry={nodes.CATALOGO.geometry}
            material={nodes.CATALOGO.material}
            position={[0, 0.461, -0.147]}
            rotation={[-0.121, 0, 0]}
            scale={[0.974, 0.426, 0.009]}
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

      {showPDF && (
        <>
          {/* Cámara para el catálogo */}
          <PerspectiveCamera
            ref={cameraRef}
            makeDefault
            position={[0, 0.5, 10]} // Ajusta la posición de la cámara
            fov={50}
          />
          <Html position={[0, 0, 0]} transform>
            <div
              style={{
                width: "400px",
                height: "300px",
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
                  backgroundColor: downloadCooldown ? "gray" : "blue",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  padding: "5px 10px",
                  cursor: downloadCooldown ? "not-allowed" : "pointer",
                  zIndex: 1,
                }}
              >
                {downloadCooldown ? `Espera ${countdown}s` : "Descargar"}
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
}

export default Catalog;

useGLTF.preload("/models/catalog.glb");
