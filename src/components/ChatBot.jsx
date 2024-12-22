import React, { useRef, useState, useEffect } from "react";
import { Html, PerspectiveCamera } from "@react-three/drei";
import { useCameraManager } from "./CameraManager";
import api from "../api";

const ChatBot = ({ standId, position, canInteract, isInteracting, setIsInteracting }) => {
  const { registerStandCamera, activateStandCamera, activatePlayerCamera } = useCameraManager();
  const cameraRef = useRef();
  const textRef = useRef(); // Referencia para el contenedor del texto
  const [showInput, setShowInput] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [displayedMessage, setDisplayedMessage] = useState("¡Hola! Hazme una pregunta.");
  const [input, setInput] = useState("");
  const [planeHeight, setPlaneHeight] = useState(100); // Altura dinámica del rectángulo
  const planeWidth = 800; // Ancho fijo del rectángulo en píxeles

  useEffect(() => {
    if (cameraRef.current) {
      registerStandCamera(standId, cameraRef.current);
    }
  }, [cameraRef, standId, registerStandCamera]);

  const adjustRectangleSize = () => {
    if (textRef.current) {
      const textContainer = textRef.current;
      // Calcular altura basada en el contenido renderizado
      const newHeight = Math.max(textContainer.scrollHeight + 20, 100); // Altura mínima de 100px
      setPlaneHeight(newHeight);
    }
  };

  useEffect(() => {
    adjustRectangleSize();
  }, [displayedMessage]);

  const revealMessage = async (message) => {
    setDisplayedMessage(""); // Limpiar el mensaje anterior
    let currentMessage = "";

    for (let char of message) {
      await new Promise((resolve) => setTimeout(resolve, 50)); // Animación gradual
      currentMessage += char;
      setDisplayedMessage(currentMessage);
    }

    adjustRectangleSize(); // Ajustar la altura al finalizar la animación
  };

  const handleChatbotClick = () => {
    if (canInteract) {
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

      const responseMessage = response.data.response || "No tengo respuesta ahora.";
      await revealMessage(responseMessage);
    } catch (error) {
      console.error("Error al obtener respuesta del chatbot:", error);
      await revealMessage("Ha surgido un error y ahora mismo no puedo contestarte.");
    } finally {
      setIsThinking(false);
    }

    setInput("");
  };

  return (
    <group position={position}>
      <PerspectiveCamera ref={cameraRef} makeDefault={false} position={[0, 0.1, 2]} fov={50} />
      <mesh onClick={handleChatbotClick}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="orange" />
      </mesh>

      {/* Mostrar texto y fondo solo si showInput es true */}
      {showInput && (
        <>
          {/* Cuadro principal */}
          <Html position={[-0.37, 0.5, 1]}>
            <div
              style={{
                width: `${planeWidth}px`,
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
                position: "relative",
              }}
            >
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
            </div>
          </Html>

        </>
      )}

      {showInput && (
        <Html center position={[0, -0.5, 0]}>
          <div
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              padding: "1rem",
              borderRadius: "8px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
              width: "500px",
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
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
