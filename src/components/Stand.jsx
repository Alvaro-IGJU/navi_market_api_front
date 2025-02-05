import React, { useRef, useEffect, useState } from "react";
import { RigidBody } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { Html, Text, useVideoTexture } from "@react-three/drei";
import api from "../api";
import { useControls } from "leva";
import ChatBot from "./ChatBot";
import StandBronce from "./StandBronce";
import Video from "./Video";
import { Mailbox } from "./Mailbox";
import Catalog from "./Catalog";
import StandSilver from "./StandSilver";
import StandGold from "./StandGold";
import Computer from "./Computer";
import layoutConfig from "../utils/interactiveConfig";
import  Phone  from "./Phone";
import LogoTexture from "./LogoTexture";
import GoogleCalendar from "./GoogleCalendar";

const Stand = React.memo(({
  id,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  size = [3, 3, 3],
  type,
  areaRadius,
  catalog_pdf,
  characterRef,
  isInteracting,
  setIsInteracting,
  getPlayerCamera,
  url_video,
  url_web,
  company_logo,
  company_name,
  videoRadius
}) => {
  
  const isCharacterInside = useRef(false);
  const areaRef = useRef();
  const videoAreaRef = useRef();
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
        { duration: Math.round(timeInside.current * 100) / 100},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
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
    } catch (error) {
      console.error(`Error recording interaction (${interactionType}):`, error.response || error);
    }
  };

  const downloadPDF = () => {
    if (!catalog_pdf) {
      console.error("No PDF data available.");
      return;
    }
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

    } catch (error) {
      console.error("Error descargando el PDF:", error);
    }
  };

  const handleClick = (interactionType) => {
    if (isCharacterInside.current) {
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
    } 
  };



  useFrame(({ scene }) => {
    if (areaRef.current) {
      const character = scene.getObjectByName("Character");
      if (!character) return;

      const distance = Math.sqrt(
        Math.pow(character.position.x - position[0], 2) +
          Math.pow(character.position.y - position[1], 2) +
          Math.pow(character.position.z - position[2], 2)
      );

      const insideArea = distance <= areaRadius;

      
      
    //  setShowVideo(distance <= videoRadius);

 

      if (insideArea && !isCharacterInside.current) {
        isCharacterInside.current = true;
        setCanInteract(true);
        startInteraction();
      } else if (!insideArea && isCharacterInside.current) {
        isCharacterInside.current = false;
        setCanInteract(false);
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



  const { mailboxPosition, videoPosition, screenPosition, planeVideoPosition, computerPosition, catalogPosition, chatbotPosition, scheduleMeetingPosition, companyLogoPosition, companyLogoPosition2 } =
    layoutConfig.position[type] || layoutConfig.position["bronze"];

  const { mailboxRotation, videoRotation, screenRotation, planeVideoRotation, computerRotation, catalogRotation, chatbotRotation, scheduleMeetingRotation, companyLogoRotation, companyLogoRotation2 } =
    layoutConfig.rotation[type] || layoutConfig.rotation["bronze"];
  return (
    <>
    <group position={position} rotation={rotation}>
    
      <mesh ref={areaRef} visible={false}>
      <sphereGeometry args={[areaRadius, 32, 32]} /> 
        <meshStandardMaterial color="green" transparent opacity={0.1} />
      </mesh>

      <mesh ref={videoAreaRef} visible={false}>
      <sphereGeometry args={[videoRadius, 32, 32]} /> 
        <meshStandardMaterial color="green"  opacity={0} />
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
  planeVideoPosition={planeVideoPosition}
  planeVideoRotation={planeVideoRotation}
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

<GoogleCalendar 
  position={scheduleMeetingPosition}
  rotation={scheduleMeetingRotation}
  scale={[0.2, 0.2, 0.2]} // Ajusta la escala según sea necesario
  handleClick={handleClick} // Pasa la función de clic
  canInteract={canInteract} // Pasa la capacidad de interacción
  isInteracting={isInteracting}
  setIsInteracting={setIsInteracting}

/>

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


      {company_logo && (
        <LogoTexture
          base64={company_logo}
          position={[companyLogoPosition[0], companyLogoPosition[1], companyLogoPosition[2]]}
          resolution={[1, 1]} // Cambia a la resolución que necesites
          rotation={companyLogoRotation}
        />
      )}

      {company_logo && (type === "silver" || type === "gold") && (
        <LogoTexture
          base64={company_logo}
          position={[companyLogoPosition2[0], companyLogoPosition2[1], companyLogoPosition2[2]]}
          resolution={[1, 1]} // Cambia a la resolución que necesites
          rotation={companyLogoRotation2}
        />
      )}
    </group>
 
    </>
  );
});

export default Stand;
