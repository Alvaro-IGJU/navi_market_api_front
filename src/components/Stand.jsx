import React, { useRef } from "react";
import { RigidBody } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";

const Stand = ({ position = [0, 0, 0], size = [1, 1, 1], color = "blue", areaRadius = 3 }) => {
  const isCharacterInside = useRef(false);
  const timeInside = useRef(0);
  const areaRef = useRef();

  useFrame(({ scene }) => {
    if (areaRef.current) {
      const character = scene.getObjectByName("Character"); // Assuming the character has this name
      
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
      } else if (!insideArea && isCharacterInside.current) {
        isCharacterInside.current = false;
        console.log("Character left the area.");
      }

      if (insideArea) {
        timeInside.current += 1 / 60; // Assuming 60 FPS
        console.log(`Time inside area: ${timeInside.current.toFixed(2)} seconds`);
      }
    }
  });

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
    </>
  );
};

export default Stand;
