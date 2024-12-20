import React, { useState, useRef, useEffect } from "react";
import { Html, PerspectiveCamera, Text } from "@react-three/drei";
import { useThree, useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import api from "../api";
import { CameraHelper, Vector3 } from "three";

const ChatBot = ({
  canInteract,
  position,
  standId,
  characterRef,
  isInteracting,
  setIsInteracting,
  getPlayerCamera
}) => {
  const [message, setMessage] = useState("¡Hola! Hazme una pregunta.");
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const isCameraActive = useRef(false); // Control de estado de cámara activa
  const chatbotRef = useRef();
  const cameraRef = useRef();
  const helperRef = useRef();
  const { camera: playerCamera, set, scene } = useThree();

  // Guardar el estado original de la cámara del jugador
  const originalCameraState = useRef({
    position: new Vector3(),
    rotation: new Vector3(),
  });

  useEffect(() => {
    if (cameraRef.current) {
      const helper = new CameraHelper(cameraRef.current);
      scene.add(helper);
      helperRef.current = helper;

      return () => {
        scene.remove(helper);
      };
    }
  }, [scene]);

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

  const handleChatbotClick = () => {
    if (canInteract && cameraRef.current) {
      isCameraActive.current = true;
      setIsInteracting(true);
      setShowInput(true);

      // Guardar la posición y rotación originales de la cámara del jugador
      originalCameraState.current.position.copy(playerCamera.position);
      originalCameraState.current.rotation.copy(playerCamera.rotation);

      console.log("Saved Camera State:", originalCameraState.current);

      // Cambiar a la cámara del chatbot
      set({ camera: cameraRef.current });
    }
  };

  const returnToPlayerCamera = () => {
    setIsInteracting(false);
    isCameraActive.current = false;
    setShowInput(false);
  
    // Restaurar la cámara original del jugador
    const playerCamera = getPlayerCamera(); // Asumiendo que esta función obtiene la cámara original
    if (playerCamera) {
      set({ camera: playerCamera });
      
      // Asegurarse de que el orden de rotación esté definido
      if (!playerCamera.rotation.order) {
        playerCamera.rotation.order = "XYZ"; // Configurar un orden de rotación por defecto
      }
  
      playerCamera.updateProjectionMatrix();
      console.log("Switched back to player camera");
    } else {
      console.warn("Player camera not available.");
    }
  };

  useFrame(() => {
    if (isCameraActive.current && cameraRef.current) {
      cameraRef.current.position.set(0, 0.1, 2);
      cameraRef.current.rotation.set(0, 0, 0);
      cameraRef.current.updateProjectionMatrix();

      if (helperRef.current) {
        helperRef.current.update();
      }
    }
  });

  return (
    <group ref={chatbotRef} position={position}>
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault={false}
        position={[0, 0.1, 6.8]}
        rotation={[0, 0, 0]}
        fov={50}
      />

      <mesh onClick={handleChatbotClick}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="orange" />
      </mesh>

      <Text
        position={[0, 0.1, 1]}
        fontSize={0.05}
        color="black"
        maxWidth={1}
        textAlign="center"
        backgroundColor="white"
        backgroundOpacity={0.8}
        anchorX="center"
        anchorY="middle"
        billboard
      >
        {isThinking ? "Pensando..." : message}
      </Text>

      {showInput && (
        <Html position={[0, -1, -1]} center transform={false} occlude={false}>
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
                width: "1000px",
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
            <button
              onClick={returnToPlayerCamera}
              style={{
                marginTop: "0.5em",
                padding: "0.5em",
                borderRadius: "4px",
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
