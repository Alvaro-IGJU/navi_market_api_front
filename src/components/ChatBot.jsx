import React, { useRef, useState, useEffect } from "react";
import { Html, PerspectiveCamera, Text } from "@react-three/drei";
import { useCameraManager } from "./CameraManager";
import api from "../api";

const ChatBot = ({ standId, position, canInteract, isInteracting, setIsInteracting }) => {
  const { registerStandCamera, activateStandCamera, activatePlayerCamera } = useCameraManager();
  const cameraRef = useRef();
  const [showInput, setShowInput] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [message, setMessage] = useState("¡Hola! Hazme una pregunta.");
  const [input, setInput] = useState("");

  useEffect(() => {
    if (cameraRef.current) {
      registerStandCamera(standId, cameraRef.current);
    }
  }, [cameraRef, standId, registerStandCamera]);

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
    setMessage("Pensando...");

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
      setMessage(response.data.response || "No tengo respuesta ahora.");
    } catch (error) {
      console.error("Error al obtener respuesta del chatbot:", error);

      if (error.response) {
        setMessage(
          "Ha surgido un error y ahora mismo no puedo contestarte. ¡Disculpa las molestias!"
        );
      } else if (error.request) {
        setMessage("Error: No se recibió respuesta del servidor.");
      } else {
        setMessage("Error: Ocurrió un problema al enviar la solicitud.");
      }
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
      <Text
        position={[0, 0.2, 1]}
        fontSize={0.05}
        color="black"
        maxWidth={1}
        textAlign="center"
        anchorX="center"
        anchorY="middle"
      >
        {isThinking ? "Pensando..." : message}
      </Text>
      {showInput && (
        <Html center position={[0,-0.5,0]}>
          <div
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              padding: "1rem",
              borderRadius: "8px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
              width: "500px"
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
