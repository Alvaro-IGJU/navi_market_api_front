import React from "react";
import { Html } from "@react-three/drei";

const Video = ({ videoUrl, showVideo, setShowVideo }) => {
  const handleVideoClick = () => {
    setShowVideo(true); // Mostrar el video
  };

  const handleCloseVideo = () => {
    setShowVideo(false); // Ocultar el video
  };

  return (
    <group>
      {/* Mesh interactivo */}
      <mesh
        position={[0.2, 0.2, 3]}
        scale={[2,1.5,2]}
        onClick={handleVideoClick}
        onPointerOver={(e) => {
          e.object.material.emissive.set("yellow");
          e.object.material.emissiveIntensity = 0.1;
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={(e) => {
          e.object.material.emissive.set("black");
          e.object.material.emissiveIntensity = 0;
          document.body.style.cursor = "default";
        }}
      >
        <boxGeometry args={[0.4, 0.3, 0.1]} />
        <meshStandardMaterial color="black" />
      </mesh>

      {/* Video HTML anclado al mesh */}
      {showVideo && (
        <Html position={[0.2, 0.2, 3]} scale={[0.6,0.6,0.6]} transform distanceFactor={1.5}>
          <div
            style={{
              width: "400px",
              height: "225px",
              background: "rgba(0, 0, 0, 0.8)",
              borderRadius: "10px",
              padding: "10px",
              boxShadow: "0 0 20px rgba(0, 0, 0, 0.5)",
            }}
          >
            <iframe
              src={videoUrl}
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
