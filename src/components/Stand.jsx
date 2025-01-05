import React, { useRef, useEffect, useState } from "react";
import { RigidBody } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { Html, useVideoTexture } from "@react-three/drei";
import api from "../api";
import { useControls } from "leva";
import ChatBot from "./ChatBot";
import StandBronce from "./StandBronce";
import StandPremium from "./StandPremium";
import StandVip from "./StandVip";
import Video from "./Video";
import Mailbox from "./Mailbox";
import Catalog from "./Catalog";
import StandSilver from "./StandSilver";
import Computer from "./Computer";
import layoutConfig from "../utils/interactiveConfig";

const Stand = ({
  id,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  size = [3, 3, 3],
  type,
  areaRadius = 8,
  catalog_pdf,
  characterRef,
  isInteracting,
  setIsInteracting,
  getPlayerCamera,
  url_video,
  url_web
}) => {
  const { posX, posY, posZ, rotX, rotY, rotZ } = useControls(`Stand ${id}`, {
    posX: { value: position[0], min: -100, max: 100, step: 0.1 },
    posY: { value: position[1], min: -100, max: 10, step: 0.1 },
    posZ: { value: position[2], min: -100, max: 100, step: 0.1 },
    rotX: { value: rotation[0], min: -Math.PI, max: Math.PI, step: 0.01 },
    rotY: { value: rotation[1], min: -Math.PI, max: Math.PI, step: 0.01 },
    rotZ: { value: rotation[2], min: -Math.PI, max: Math.PI, step: 0.01 },
  });
  console.log("A",url_video)
  const isCharacterInside = useRef(false);
  const areaRef = useRef();
  const [canInteract, setCanInteract] = useState(false);
  const [showVideo, setShowVideo] = useState(false); // Estado para mostrar el video
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
    if (!catalog_pdf) {
      console.error("No PDF data available.");
      return;
    }
    console.log(catalog_pdf)
    try {
      const binary = atob(catalog_pdf);
      const array = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        array[i] = binary.charCodeAt(i);
      }
      const blob = new Blob([array], { type: "application/pdf" });

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
        try {
          // Registra la interacción antes de intentar descargar
          sendInteraction(interactionType);
          downloadPDF();
        } catch (error) {
          console.error("Error during catalog interaction:", error);
        }
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
        setCanInteract(true);
        console.log("Character entered the area.");
        startInteraction();
      } else if (!insideArea && isCharacterInside.current) {
        isCharacterInside.current = false;
        setCanInteract(false);
        setShowVideo(false); 
        console.log("Character left the area.");
        endInteraction();
      }

      if (insideArea) {
        timeInside.current += 1 / 60;
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



  const { mailboxPosition, videoPosition, screenPosition, computerPosition, catalogPosition, chatbotPosition } =
    layoutConfig.position[type] || layoutConfig.position["bronze"];

  const { mailboxRotation, videoRotation, screenRotation, computerRotation, catalogRotation, chatbotRotation } =
    layoutConfig.rotation[type] || layoutConfig.rotation["bronze"];
  return (
    <>
    <group position={[posX, posY, posZ]} rotation={[rotX, rotY, rotZ]}>
      {type === "bronze" && (
        <StandBronce scale={[0.1, 0.1, 0.1]} size={size} position={[0, -1, 0]} rotation={[0, 0, 0]} />
      )}
      {type === "silver" && (
        <StandSilver scale={[0.5, 0.5, 0.5]} size={size} position={[0, -1, 0]} rotation={[0, 6, 0]} />
      )}
      {type === "gold" && (
        <StandVip scale={[1, 1, 1]} size={size} position={[0, -1, 0]} rotation={[0, 6, 0]} />
      )}

      <mesh ref={areaRef}>
      {/* <sphereGeometry args={[areaRadius, 32, 32]} />  */}
        <meshStandardMaterial color="green" transparent opacity={0.2} />
      </mesh>

    

<Mailbox scale={[0.1, 0.1, 0.1]}
         rotation={mailboxRotation} 
         position={mailboxPosition} 
         handleClick={handleClick} 
         canInteract={canInteract}   
         isInteracting={isInteracting}
 />


<Video
  videoUrl={url_video}
  showVideo={showVideo}
  setShowVideo={setShowVideo}
  setIsInteracting={setIsInteracting}
  screenPosition={screenPosition}
  screenRotation={screenRotation}
  videoPosition={videoPosition}
  videoRotation={videoRotation}
  handleClick={handleClick}
  canInteract={canInteract} // Pasa la capacidad de interacción
  isInteracting={isInteracting}
/>

<Computer 
  position={computerPosition} // Posición en el espacio 3D
  scale={[1.5, 1.5, 1.5]} // Escala del modelo
  rotation={computerRotation} // Rotación en radianes (eje X, Y, Z)
  canInteract={true} // Habilita la interacción con el modelo
  isInteracting={false} // Controla si actualmente está interactuando
  handleClick={handleClick}
  webUrl={url_web}
/>


<Catalog
  position={catalogPosition}
  rotation={catalogRotation}
  scale={[0.1, 0.1, 0.1]} // Ajusta la escala según sea necesario
  handleClick={handleClick} // Pasa la función de clic
  canInteract={canInteract} // Pasa la capacidad de interacción
  isInteracting={isInteracting}
  setIsInteracting={setIsInteracting}
  catalogBase64={catalog_pdf}
/>


<RigidBody type="fixed">
  <mesh
    position={[0.7, -0.3, 3]}
    onClick={() => handleClick("schedule_meeting")}
    onPointerOver={(e) => {
      if(canInteract){
        e.object.material.emissive.set("yellow"); // Añade un brillo amarillo
        e.object.material.emissiveIntensity = 0.1; // Ajusta la intensidad del brillo
        document.body.style.cursor = "pointer";
      }
    }}
    onPointerOut={(e) => {
      e.object.material.emissive.set("black");
      e.object.material.emissiveIntensity = 0;
      document.body.style.cursor = "default";
    }}
  >
    <boxGeometry args={[0.1, 0.2, 0.1]} />
    <meshStandardMaterial color="red" />
  </mesh>
</RigidBody>


      <ChatBot
        canInteract={canInteract}
        position={chatbotPosition}
        rotation = {chatbotRotation}
        standId={id}
        isInteracting={isInteracting}
        setIsInteracting={setIsInteracting}
        getPlayerCamera={getPlayerCamera}
        handleClick={handleClick}
        
      />
    </group>
 
    </>
  );
};

export default Stand;
