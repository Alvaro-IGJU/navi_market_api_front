import React, { useState, useRef, useEffect } from "react";
import { Html } from "@react-three/drei";
import Screen from "./Screen";

const Video = ({
  videoUrl,
  showVideo,
  setShowVideo,
  screenPosition,
  screenRotation,
  videoPosition,
  videoRotation,
  handleClick,
  canInteract,
  isInteracting,
}) => {
  const [hoverMessage, setHoverMessage] = useState(null);
  const [isHovering, setIsHovering] = useState(false);
  const materialsRef = useRef([]); // Almacena referencias a los materiales del modelo

  const setMaterialsEmissive = (color, intensity) => {
    materialsRef.current.forEach((material) => {
      material.emissive.set(color);
      material.emissiveIntensity = intensity;
    });
  };

  const handleVideoClick = () => {
    if (canInteract && !isInteracting) {
      setShowVideo(true);
      handleClick("show_video");
    }
  };

  const handlePointerOver = (e) => {
    if (canInteract && !isInteracting) {
      setIsHovering(true);

      if (!materialsRef.current.length) {
        const { material } = e.object;
        if (Array.isArray(material)) {
          materialsRef.current = material;
        } else {
          materialsRef.current = [material];
        }
      }

      setMaterialsEmissive("yellow", 0.1);
      document.body.style.cursor = "pointer";
      setHoverMessage("Ver vídeo");
    }
  };

  const handlePointerOut = () => {
    setIsHovering(false);
    setMaterialsEmissive("black", 0);
    document.body.style.cursor = "default";
    setHoverMessage(null);
  };

  const handleCloseVideo = () => {
    setShowVideo(false);
  };

  return (
    <group>
      {/* Modelo interactivo */}
      <group
        screenPosition={screenPosition}
        rotation={screenRotation}
        scale={[0.15, 0.15, 0.15]}
        onClick={handleVideoClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <Screen position={screenPosition} />
      </group>

      {/* Mensaje interactivo */}
      {hoverMessage && isHovering && canInteract && !isInteracting && (
        <Html
          position={[videoPosition[0], videoPosition[1] + 0.2, videoPosition[2] + 0.2]}
          style={{
            background: "rgba(0, 0, 0, 0.8)",
            color: "white",
            padding: "5px 20px",
            borderRadius: "5px",
            fontSize: "12px",
            width: "91px",
          }}
        >
          {hoverMessage}
        </Html>
      )}

      {/* Video HTML anclado al modelo */}
      {showVideo && (
        <Html
          rotation={videoRotation}
          position={[videoPosition[0], videoPosition[1], videoPosition[2]]}
          scale={[0.7, 0.7, 0.7]}
          transform
          distanceFactor={1.5}
          occlude
          zIndexRange={[1, 10]}
        >
          <div
            style={{
              width: "400px",
              height: "225px",
              background: "rgba(0, 0, 0, 0.8)",
              borderRadius: "10px",
              padding: "10px",
              boxShadow: "0 0 20px rgba(0, 0, 0, 0.5)",
              position: "relative",
            }}
          >
            <iframe
              src={`https://www.youtube.com/embed/${videoUrl}`}
              style={{ width: "100%", height: "100%", border: "none" }}
              title="YouTube Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            <button
              onClick={handleCloseVideo}
              style={{
                position: "absolute",
                top: "-10px",
                right: "-10px",
                background: "red",
                color: "white",
                border: "none",
                borderRadius: "50%",
                width: "30px",
                height: "30px",
                cursor: "pointer",
              }}
            >
              X
            </button>
          </div>
        </Html>
      )}
    </group>
  );
};

export default Video;
