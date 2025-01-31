import React, { useRef } from "react";
import { TextureLoader, DoubleSide } from "three";
import { useLoader, useFrame } from "@react-three/fiber";

const LogoTexture = ({ base64, position = [0, 0, 0], resolution = [2, 2], rotation=[0,0,0] }) => {
  const texture = useLoader(TextureLoader, `data:image/png;base64,${base64}`);
  const meshRef = useRef(); // Referencia al mesh para manipular la rotación

  

  // Esperar a que la textura esté disponible
  if (!texture || !texture.image) {
    return null; // No renderizar nada hasta que la textura esté lista
  }

  // Calcular proporción
  const aspectRatio = texture.image.width / texture.image.height;
  const [desiredWidth] = resolution;
  const planeWidth = desiredWidth;
  const planeHeight = desiredWidth / aspectRatio;

  return (
    <mesh ref={meshRef} position={position} rotation={rotation}>
      <planeGeometry args={[planeWidth, planeHeight]} />
      <meshBasicMaterial
        map={texture}
        transparent={true} // Habilita la transparencia
         
      />
    </mesh>
  );
};

export default LogoTexture;
