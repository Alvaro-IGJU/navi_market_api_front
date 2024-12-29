import React, { useState } from "react";
import { Html } from "@react-three/drei";
import Screen from "./Screen"; // Importa el componente Screen

const Video = ({ videoUrl, showVideo, setShowVideo, position, handleClick, canInteract, isInteracting }) => {
  const [hoverMessage, setHoverMessage] = useState(null); // Estado para el mensaje interactivo

  const handleVideoClick = () => {
    if (canInteract && !isInteracting) {
      console.log("Opening video with URL:", videoUrl); // Imprime el valor al abrir el video
      setShowVideo(true); // Mostrar el video
      handleClick("show_video"); // Llama a la función pasada como prop
    }
  };

  const handleCloseVideo = () => {
    console.log("Closing video"); // Imprime al cerrar el video
    setShowVideo(false); // Ocultar el video
  };

  return (
    <group>
      {/* Modelo interactivo */}
      <group
        position={position}
        rotation={[Math.PI / 2, Math.PI, Math.PI]}
        scale={[0.08, 0.08, 0.08]} // Ajusta el tamaño del modelo
        onClick={handleVideoClick}
        onPointerOver={(e) => {
          if (canInteract && !isInteracting) {
            e.object.material.emissive.set("yellow"); // Añade brillo amarillo
            e.object.material.emissiveIntensity = 0.1; // Ajusta la intensidad
            document.body.style.cursor = "pointer";
            setHoverMessage("Ver vídeo"); // Establece el mensaje interactivo
          }
        }}
        onPointerOut={(e) => {
          e.object.material.emissive.set("black"); // Elimina el brillo
          e.object.material.emissiveIntensity = 0;
          document.body.style.cursor = "default";
          setHoverMessage(null); // Limpia el mensaje interactivo
        }}
      >
        {/* Usa el componente Screen aquí con la rotación adecuada */}
        <Screen position={[0, -10, 0]} />
      </group>

      {/* Muestra el mensaje interactivo */}
      {hoverMessage && canInteract && !isInteracting && (
        <Html
        position={[position[0], position[1] + 0.2, position[2] + 0.2]}
          style={{
            background: "rgba(0, 0, 0, 0.8)",
            color: "white",
            padding: "5px 20px",
            borderRadius: "5px",
            fontSize: "12px",
            width: "91px"
          }}
        >
          {hoverMessage}
        </Html>
      )}

      {/* Video HTML anclado al modelo */}
      {showVideo && (
        <Html
          rotation={[0, Math.PI / 2, 0]}
          position={[0.29, 0.02, 0]}
          scale={[0.41, 0.41, 0.41]}
          transform
          distanceFactor={1.5}
          occlude // Activa el occlude para ocultar detrás de otros objetos
          zIndexRange={[1, 10]} // Ajusta el rango del índice Z si es necesario
        >
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
