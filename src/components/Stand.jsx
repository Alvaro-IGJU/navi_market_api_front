import React, { useRef, useEffect } from "react";
import { RigidBody } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import api from "../api";

const Stand = ({ id, position = [0, 0, 0], size = [1, 1, 1], color = "blue", areaRadius = 3 }) => {
  const isCharacterInside = useRef(false);
  const timeInside = useRef(0);
  const interactionId = useRef(null);
  const areaRef = useRef();

  // Start interaction when entering the stand area
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

  // Update time spent in the stand area
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
      console.log(`Duration updated for interaction ${interactionId.current}: ${timeInside.current} seconds`);
      timeInside.current = 0;
    } catch (error) {
      console.error("Error updating interaction duration:", error.response || error);
    }
  };

  // End interaction when leaving the stand area
  const endInteraction = async () => {
    if (!interactionId.current) return;

    await updateInteractionDuration();
    interactionId.current = null;
    console.log("Interaction ended.");
  };

  // Handle specific object interactions
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

      if (insideArea && !isCharacterInside.current) {
        isCharacterInside.current = true;
        console.log("Character entered the area.");
        startInteraction();
      } else if (!insideArea && isCharacterInside.current) {
        isCharacterInside.current = false;
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

  const handleClick = (interactionType) => {
    if (isCharacterInside.current) {
      console.log(`Interaction triggered: ${interactionType}`);
      sendInteraction(interactionType);
    } else {
      console.log("Character is not inside the area. Cannot interact.");
    }
  };

  return (
    <>
      {/* Stand */}
      <RigidBody type="fixed">
        <mesh position={position}>
          <boxGeometry args={size} />
          <meshStandardMaterial color={color} />
        </mesh>
      </RigidBody>

      {/* Detection Area */}
      <mesh position={position} ref={areaRef}>
        <sphereGeometry args={[areaRadius, 32, 32]} />
        <meshStandardMaterial color="green" transparent opacity={0.2} />
      </mesh>

      {/* Mailbox */}
      <RigidBody type="fixed">
        <mesh
          position={[position[0] - 0.5, position[1] - 0.5, position[2] + 1]}
          onClick={() => handleClick("mailbox")}
        >
          <boxGeometry args={[0.2, 0.2, 0.2]} />
          <meshStandardMaterial color="yellow" />
        </mesh>
      </RigidBody>

      {/* Laptop */}
      <RigidBody type="fixed">
        <mesh
          position={[position[0] - 0.2, position[1], position[2] + 1]}
          onClick={() => handleClick("info_pc")}
        >
          <boxGeometry args={[0.3, 0.1, 0.2]} />
          <meshStandardMaterial color="gray" />
        </mesh>
      </RigidBody>

      {/* Screen */}
      <RigidBody type="fixed">
        <mesh
          position={[position[0] + 0.2, position[1] + 0.2, position[2] + 1]}
          onClick={() => handleClick("play_video")}
        >
          <boxGeometry args={[0.4, 0.3, 0.1]} />
          <meshStandardMaterial color="black" />
        </mesh>
      </RigidBody>

      {/* Catalog */}
      <RigidBody type="fixed">
        <mesh
          position={[position[0] + 0.5, position[1] - 0.5, position[2] + 1]}
          onClick={() => handleClick("download_catalog")}
        >
          <boxGeometry args={[0.2, 0.05, 0.3]} />
          <meshStandardMaterial color="green" />
        </mesh>
      </RigidBody>

      {/* Phone */}
      <RigidBody type="fixed">
        <mesh
          position={[position[0] + 0.7, position[1] - 0.3, position[2] + 1]}
          onClick={() => handleClick("schedule_meeting")}
        >
          <boxGeometry args={[0.1, 0.2, 0.1]} />
          <meshStandardMaterial color="red" />
        </mesh>
      </RigidBody>
    </>
  );
};

export default Stand;
