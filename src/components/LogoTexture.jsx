import React, { useRef } from "react";
import { TextureLoader, DoubleSide } from "three";
import { useLoader, useFrame } from "@react-three/fiber";

const LogoTexture = ({ base64, position = [0, 0, 0], resolution = [2, 2] }) => {
  const texture = useLoader(TextureLoader, `data:image/png;base64,${base64}`);
  const meshRef = useRef(); // Referencia al mesh para manipular la rotación

  // Actualizar rotación en cada frame
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01; // Incrementar la rotación alrededor del eje Y

      // Si la rotación alcanza 180° (Math.PI), reiniciarla a 0
      if (meshRef.current.rotation.y >= Math.PI) {
        meshRef.current.rotation.y = 0; // Volver a la posición inicial
      }
    }
  });

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
    <mesh ref={meshRef} position={position}>
      <planeGeometry args={[planeWidth, planeHeight]} />
      <meshBasicMaterial
        map={texture}
        transparent={true} // Habilita la transparencia
         // Habilita visibilidad en ambas caras
        opacity={1.0} // Asegura opacidad total
      />
    </mesh>
  );
};

export default LogoTexture;
