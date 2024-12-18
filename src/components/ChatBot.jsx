import React, { useState } from "react";
import { Html, Text } from "@react-three/drei";
import api from "../api";

const ChatBot = ({canInteract,  position, standId }) => {
  const [message, setMessage] = useState("¡Hola! Hazme una pregunta.");
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false); // To manage "thinking" state

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
      console.error("Error al obtener la respuesta del chatbot:", error);

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
      {/* NPC Model */}
      <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="orange" />
      </mesh>

      {/* Speech Bubble with Billboarding */}
      <Text
        position={[0, 0.1, 1]} // Adjusted above the NPC
        fontSize={0.05}
        color="black"
        maxWidth={1}
        textAlign="center"
        backgroundColor="white"
        backgroundOpacity={0.8}
        anchorX="center"
        anchorY="middle"
        billboard // Ensures the text always faces the camera
      >
        {isThinking ? "Pensando..." : message}
      </Text>

      {/* Chat Input */}
     {canInteract && <Html position={[0, -1.5, 0]} center>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            padding: "0.5em",
            borderRadius: "8px",
          }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu pregunta..."
            style={{
              padding: "0.5em",
              borderRadius: "4px",
              border: "1px solid #ccc",
              marginBottom: "0.5em",
              width: "150px",
            }}
          />
          <button
            onClick={sendMessage}
            style={{
              padding: "0.5em",
              borderRadius: "4px",
              backgroundColor: isThinking ? "gray" : "blue",
              color: "white",
              cursor: isThinking ? "not-allowed" : "pointer",
            }}
            disabled={isThinking}
          >
            Enviar
          </button>
        </div>
      </Html>}
    </group>
  );
};

export default ChatBot;
