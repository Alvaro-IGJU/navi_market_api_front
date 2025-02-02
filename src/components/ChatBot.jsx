import React, { useRef, useEffect, useState, useMemo } from "react";
import { Html, PerspectiveCamera } from "@react-three/drei";
import { useCameraManager } from "./CameraManager";
import api from "../api";
import { applyAccentRules } from "../utils/chatBotInputAccentRules";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import Avatar from "./Avatar";

const ChatBot = ({
  standId,
  position,
  rotation,
  canInteract,
  isInteracting,
  setIsInteracting,
  handleClick,
}) => {
  const { registerStandCamera, activateStandCamera, activatePlayerCamera } =
    useCameraManager();
  const cameraRef = useRef();
  const textRef = useRef();
  const [showInput, setShowInput] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [displayedMessage, setDisplayedMessage] = useState(
    "¡Hola! Hazme una pregunta."
  );
  const [input, setInput] = useState("");
  const [planeHeight, setPlaneHeight] = useState(100);
  const [planeWidth, setPlaneWidth] = useState(window.innerWidth * 0.8);
  const texture = useLoader(TextureLoader, "/multimedia/images/DEGRADADO_NAVI-15.png");

  // Usamos useMemo para determinar si es un dispositivo móvil (se calcula una sola vez)
  const isMobile = useMemo(() => window.innerWidth <= 768, []);

  useEffect(() => {
    if (cameraRef.current) {
      registerStandCamera(standId, cameraRef.current);
    }
  }, [cameraRef, standId, registerStandCamera]);

  const adjustRectangleSize = () => {
    if (textRef.current) {
      const textContainer = textRef.current;
      const newHeight = Math.max(textContainer.scrollHeight + 20, 100);
      setPlaneHeight(newHeight);
    }
  };

  const updatePlaneWidth = () => {
    setPlaneWidth(window.innerWidth * 0.8);
  };

  useEffect(() => {
    adjustRectangleSize();
  }, [displayedMessage]);

  useEffect(() => {
    window.addEventListener("resize", updatePlaneWidth);
    return () => {
      window.removeEventListener("resize", updatePlaneWidth);
    };
  }, []);

  const revealMessage = async (message) => {
    setDisplayedMessage("");
    let currentMessage = "";

    for (let char of message) {
      await new Promise((resolve) => setTimeout(resolve, 50));
      currentMessage += char;
      setDisplayedMessage(currentMessage);
    }

    adjustRectangleSize();
  };

  const handleChatbotClick = () => {
    if (canInteract && !isInteracting) {
      setIsInteracting(true);
      setShowInput(true);
      activateStandCamera(standId);
    }
  };

  const returnToPlayerCamera = () => {
    setIsInteracting(false);
    setShowInput(false);
    activatePlayerCamera();
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    setIsThinking(true);
    setDisplayedMessage("Pensando...");

    try {
      const token = localStorage.getItem("accessToken");
      const response = await api.post(
        `/interactions/chatbot/${standId}/`,
        { question: input },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (handleClick) {
        handleClick("talk_chatbot");
      }
      const responseMessage =
        response.data.response || "No tengo respuesta ahora.";
      await revealMessage(responseMessage);
    } catch (error) {
      console.error("Error al obtener respuesta del chatbot:", error);
      await revealMessage(
        "Ha surgido un error y ahora mismo no puedo contestarte."
      );
    } finally {
      setIsThinking(false);
    }

    setInput("");
  };

  // Memoizamos el estilo del cuadro principal para el mensaje
  const mainHtmlStyle = useMemo(
    () => ({
      width: `${planeWidth}px`, // Ancho dinámico basado en estado
      maxWidth: "800px", // Ancho máximo
      height: `${planeHeight}px`,
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      borderRadius: "8px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      padding: "8px",
      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
      overflow: "hidden",
      position: "absolute", // Posición fija en 3D
      left: "50%", // Centrado horizontal
      transform: "translateX(-50%)", // Ajuste fino del centrado
    }),
    [planeWidth, planeHeight]
  );

  // Memoizamos el estilo del contenedor del input
  const inputContainerStyle = useMemo(
    () => ({
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      padding: "1rem",
      borderRadius: "8px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
      width:
        window.innerWidth > 1200
          ? "500px" // Pantallas grandes
          : window.innerWidth > 768
          ? "400px" // Pantallas medianas
          : "300px", // Pantallas pequeñas
      maxWidth: "500px",
    }),
    []
  );

  return (
    <group position={position} rotation={rotation}>
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault={false}
        position={[0, 0.7, 2]}
        fov={50}
      />
    
        <Avatar 
          scale={[0.45, 0.45, 0.45]}
          onClick={handleChatbotClick}
          onPointerOver={(e) => {
            if (canInteract && !isInteracting) {

              document.body.style.cursor = "pointer";
            }
          }}
          onPointerOut={(e) => {

            document.body.style.cursor = "default";
          }}
        />
     

      {showInput && (
        <>
          <Html position={[0, 1.1, 1]} style={mainHtmlStyle}>
            <div
              ref={textRef}
              className="text-content"
              style={{
                whiteSpace: "normal",
                fontSize: "20px",
                lineHeight: "1.5",
              }}
            >
              {displayedMessage}
            </div>
          </Html>
        </>
      )}

      {showInput && (
        <Html center position={[0, isMobile ? 0. : -0, 0]}>
          <div style={inputContainerStyle}>
            <input
              type="text"
              value={input}
              onChange={(e) => {
                const accented = applyAccentRules(e.target.value);
                setInput(accented);
              }}
              placeholder="Escribe tu pregunta..."
              style={{
                padding: "0.5rem",
                border: "1px solid #ccc",
                borderRadius: "4px",
                marginBottom: "1rem",
                width: "100%",
              }}
            />
            <button
              onClick={sendMessage}
              disabled={isThinking}
              style={{
                padding: "0.5rem 1rem",
                marginBottom: "0.5rem",
                borderRadius: "4px",
                border: "none",
                backgroundColor: isThinking ? "gray" : "#007BFF",
                color: "white",
                cursor: isThinking ? "not-allowed" : "pointer",
              }}
            >
              {isThinking ? "Pensando..." : "Enviar"}
            </button>
            <button
              onClick={returnToPlayerCamera}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "4px",
                border: "none",
                backgroundColor: "red",
                color: "white",
                cursor: "pointer",
              }}
            >
              Regresar
            </button>
          </div>
        </Html>
      )}
    </group>
  );
};

export default ChatBot;
