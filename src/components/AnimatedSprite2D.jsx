import { useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';
import { TextureLoader, NearestFilter } from 'three';

export function AnimatedSprite2D({
  textureUrl = '/sprites/sprite_character_32px.png', // Ruta del spritesheet
  rows = 6, // Número de filas en el spritesheet
  cols = 6, // Número de columnas en el spritesheet
  frameRate = 10, // Velocidad de animación (cuadros por segundo)
  activeRow = 0, // Fila activa para la animación (empieza desde 0)
  scale = 1, // Escala del personaje
  position = [0, 0, 0], // Posición inicial del personaje en el mundo 3D
}) {
  const meshRef = useRef();
  const [texture] = useState(() => {
    const tex = new TextureLoader().load(textureUrl);
    tex.minFilter = NearestFilter; // Filtro para evitar borrosidad
    tex.magFilter = NearestFilter; // Filtro para evitar borrosidad
    tex.generateMipmaps = false; // No generar mipmaps
    return tex;
  });

  const frameWidth = 0.5 / cols; // Ancho de cada cuadro en coordenadas UV
  const frameHeight = 0.5 / rows; // Alto de cada cuadro en coordenadas UV
  const framesPerRow = cols; // Total de cuadros por fila
  const elapsedTime = useRef(0); // Tiempo acumulado para manejar el frameRate
  const currentFrame = useRef(0); // Cuadro actual dentro de la fila activa

  useFrame((state, delta) => {
    // Acumular el tiempo transcurrido
    elapsedTime.current += delta;

    // Cambiar de cuadro según el frameRate
    if (elapsedTime.current > 2.5 / frameRate) {
      currentFrame.current = (currentFrame.current + 1) % framesPerRow; // Avanzar al siguiente cuadro dentro de la fila
      const col = currentFrame.current; // Columna actual en la fila activa

      // Actualizar las coordenadas UV del sprite
      texture.offset.set(col * frameWidth, 1 - (activeRow + 1) * frameHeight); // Ajustar UV según la fila activa
      texture.repeat.set(frameWidth, frameHeight); // Ajustar el tamaño de cada cuadro

      elapsedTime.current = 0; // Reiniciar el tiempo acumulado
    }
  });

  return (
    <mesh ref={meshRef} scale={scale} position={position} rotation={[0,Math.PI, 0]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={texture} transparent />
    </mesh>
  );
}

export default AnimatedSprite2D;
