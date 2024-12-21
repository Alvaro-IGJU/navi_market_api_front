import React, { useRef, useState, useEffect } from "react";
import { Html, PerspectiveCamera, Text } from "@react-three/drei";
import { useCameraManager } from "./CameraManager";
import api from "../api";

const ChatBot = ({ standId, position, canInteract, isInteracting, setIsInteracting }) => {
  const { registerStandCamera, activateStandCamera, activatePlayerCamera } = useCameraManager();
  const cameraRef = useRef();
  const [showInput, setShowInput] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [displayedMessage, setDisplayedMessage] = useState("¡Hola! Hazme una pregunta."); // Mensaje mostrado gradualmente
  const [fullMessage, setFullMessage] = useState(""); // Mensaje completo
  const [input, setInput] = useState("");

  useEffect(() => {
    if (cameraRef.current) {
      registerStandCamera(standId, cameraRef.current);
    }
  }, [cameraRef, standId, registerStandCamera]);

  // Función para mostrar el mensaje gradualmente
  const revealMessage = (message) => {
    setDisplayedMessage(""); // Limpiar el mensaje mostrado inicialmente
    let index = 0;

    const interval = setInterval(() => {
      setDisplayedMessage((prev) => prev + message[index - 1]);
      index += 1;

      if (index >= message.length) {
        clearInterval(interval); // Detener el intervalo cuando todo el mensaje ha sido mostrado
      }
    }, 50); // Velocidad del texto (50ms por carácter)
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
    setDisplayedMessage("Pensando..."); // Mostrar un mensaje mientras se procesa la solicitud

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
      setFullMessage(responseMessage); // Establecer el mensaje completo
      revealMessage(responseMessage); // Iniciar la animación de texto
    } catch (error) {
      console.error("Error al obtener respuesta del chatbot:", error);

      const errorMessage =
        error.response?.data?.message ||
        "Ha surgido un error y ahora mismo no puedo contestarte. ¡Disculpa las molestias!";
      setFullMessage(errorMessage); // Establecer el mensaje de error
      revealMessage(errorMessage); // Mostrar el mensaje de error gradualmente
    } finally {
      setIsThinking(false);
    }

    setInput(""); // Limpiar el campo de entrada
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
        {displayedMessage} {/* Mostrar el mensaje gradualmente */}
      </Text>
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
