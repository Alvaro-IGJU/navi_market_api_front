import React, { useRef, useEffect, useState } from "react";
import { RigidBody } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import api from "../api";
import { useControls } from "leva";
import ChatBot from "./ChatBot";
import StandBasic from "./StandBasic";
import StandPremium from "./StandPremium";
import StandVip from "./StandVip";

const Stand = ({
  id,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  size = [3, 3, 3],
  type,
  areaRadius = 8,
  pdf
}) => {
  const { posX, posY, posZ, rotX, rotY, rotZ } = useControls(`Stand ${id}`, {
    posX: { value: position[0], min: -100, max: 100, step: 0.1 },
    posY: { value: position[1], min: -100, max: 10, step: 0.1 },
    posZ: { value: position[2], min: -100, max: 100, step: 0.1 },
    rotX: { value: rotation[0], min: -Math.PI, max: Math.PI, step: 0.01 },
    rotY: { value: rotation[1], min: -Math.PI, max: Math.PI, step: 0.01 },
    rotZ: { value: rotation[2], min: -Math.PI, max: Math.PI, step: 0.01 },
  });

  const isCharacterInside = useRef(false);
  const areaRef = useRef();
  const [canInteract, setCanInteract] = useState(false); // Controla si se puede interactuar con el ChatBot
  const timeInside = useRef(0);
  const interactionId = useRef(null);

  const startInteraction = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await api.post(
        `/interactions/register/${id}/`,
        { interaction_type: "stand_entry" },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      interactionId.current = response.data.interaction_id;
      console.log("Interaction started:", response.data);
    } catch (error) {
      console.error("Error starting interaction:", error.response || error);
    }
  };

  const updateInteractionDuration = async () => {
    if (!interactionId.current) return;

    try {
      const token = localStorage.getItem("accessToken");
      await api.post(
        `/interactions/update-duration/${interactionId.current}/`,
        { duration: Math.round(timeInside.current) },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(
        `Duration updated for interaction ${interactionId.current}: ${timeInside.current} seconds`
      );
      timeInside.current = 0;
    } catch (error) {
      console.error("Error updating interaction duration:", error.response || error);
    }
  };

  const endInteraction = async () => {
    if (!interactionId.current) return;

    await updateInteractionDuration();
    interactionId.current = null;
    console.log("Interaction ended.");
  };

  const sendInteraction = async (interactionType) => {
    try {
      const token = localStorage.getItem("accessToken");
      await api.post(
        `/interactions/register/${id}/`,
        { interaction_type: interactionType },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(`Interaction recorded: ${interactionType}`);
    } catch (error) {
      console.error(`Error recording interaction (${interactionType}):`, error.response || error);
    }
  };

  const downloadPDF = () => {
    console.log("PDF",pdf)

    try {
      if (!pdf) {
        console.error("No PDF data available.");
        return;
      }

      // Crear un Blob desde el Base64
      const binary = atob(pdf);
      const array = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        array[i] = binary.charCodeAt(i);
      }
      const blob = new Blob([array], { type: "application/pdf" });

      // Crear un enlace de descarga
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "catalogo.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();

      console.log("PDF descargado exitosamente.");
    } catch (error) {
      console.error("Error descargando el PDF:", error);
    }
  };

  const handleClick = (interactionType) => {
    if (isCharacterInside.current) {
      console.log(`Interaction triggered: ${interactionType}`);
      if (interactionType === "download_catalog") {
        downloadPDF(); // Llama a la función para descargar el PDF
      } else {
        sendInteraction(interactionType);
      }
    } else {
      console.log("Character is not inside the area. Cannot interact.");
    }
  };

  useFrame(({ scene }) => {
    if (areaRef.current) {
      const character = scene.getObjectByName("Character");
      if (!character) return;

      const distance = Math.sqrt(
        Math.pow(character.position.x - posX, 2) +
          Math.pow(character.position.y - posY, 2) +
          Math.pow(character.position.z - posZ, 2)
      );

      const insideArea = distance <= areaRadius;

      if (insideArea && !isCharacterInside.current) {
        isCharacterInside.current = true;
        setCanInteract(true); // Permite interactuar con el ChatBot
        console.log("Character entered the area.");
        startInteraction();
      } else if (!insideArea && isCharacterInside.current) {
        isCharacterInside.current = false;
        setCanInteract(false); // Desactiva la interacción con el ChatBot
        console.log("Character left the area.");
        endInteraction();
      }

      if (insideArea) {
        timeInside.current += 1 / 60; // Assuming 60 FPS
      }
    }
  });

  useEffect(() => {
    return () => {
      if (isCharacterInside.current) {
        endInteraction();
      }
    };
  }, []);

  return (
    <group position={[posX, posY, posZ]} rotation={[rotX, rotY, rotZ]}>
      {/* Stand */}
        {/* Stand */}
      {type === 'basic' &&  <StandBasic scale={[10,10,10]} size={size} position={[0, -1, 0]} rotation={[0, 6, 0]} /> }
      {type === 'premium' && <StandPremium scale={[10,10,10]} size={size} position={[0, -1, 0]} rotation={[0, 1, 0]} /> }
      {type === 'vip' &&<StandVip scale={[1,1,1]} size={size} position={[0, -1, 0]} rotation={[0, 6, 0]} />}

      {/* Detection Area */}
      <mesh ref={areaRef}>
        <meshStandardMaterial color="green" transparent opacity={0.2} />
      </mesh>

      {/* Mailbox */}
      <RigidBody type="fixed">
        <mesh
          position={[-0.5, -0.5, 3]}
          onClick={() => handleClick("mailbox")}
        >
          <boxGeometry args={[0.2, 0.2, 0.2]} />
          <meshStandardMaterial color="yellow" />
        </mesh>
      </RigidBody>

      {/* Laptop */}
      <RigidBody type="fixed">
        <mesh position={[-0.2, 0, 3]} onClick={() => handleClick("info_pc")}>
          <boxGeometry args={[0.3, 0.1, 0.2]} />
          <meshStandardMaterial color="gray" />
        </mesh>
      </RigidBody>

      {/* Screen */}
      <RigidBody type="fixed">
        <mesh position={[0.2, 0.2, 3]} onClick={() => handleClick("play_video")}>
          <boxGeometry args={[0.4, 0.3, 0.1]} />
          <meshStandardMaterial color="black" />
        </mesh>
      </RigidBody>

      {/* Catalog */}
      <RigidBody type="fixed">
        <mesh
          position={[0.5, -0.5, 3]}
          onClick={() => handleClick("download_catalog")}
        >
          <boxGeometry args={[0.2, 0.05, 0.3]} />
          <meshStandardMaterial color="green" />
        </mesh>
      </RigidBody>

      {/* Phone */}
      <RigidBody type="fixed">
        <mesh
          position={[0.7, -0.3, 3]}
          onClick={() => handleClick("schedule_meeting")}
        >
          <boxGeometry args={[0.1, 0.2, 0.1]} />
          <meshStandardMaterial color="red" />
        </mesh>
      </RigidBody>

        {/* ChatBot */}
      {/* {canInteract && <ChatBot position={[0, 0.1, 5]} standId={id} />} */}
      { <ChatBot canInteract = {canInteract} position={[0, 0.1, 5]} standId={id} />}
    </group>
  );
};

export default Stand;
