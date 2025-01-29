import { useRef, useEffect } from "react";
import { extend, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";
import { useControls } from "leva";

// Shader para hierba con mejor realismo y movimiento natural
const GrassShaderMaterial = shaderMaterial(
  {
    time: 0,
    color1: new THREE.Color(0.1, 0.5, 0.1), // Verde oscuro en la base
    color2: new THREE.Color(0.3, 0.9, 0.3), // Verde claro en la punta
    windStrength: 0.2, // Intensidad del viento
  },
  // Vertex Shader
  `
  varying vec2 vUv;
  varying float vHeight;
  uniform float time;
  uniform float windStrength;
  
  void main() {
    vUv = uv;
    vec3 pos = position;
    
    // Efecto de viento más natural con desplazamiento en la parte superior
    float wave = sin(pos.x * 4.0 + time * windStrength) * 0.1;
    wave += cos(pos.z * 4.0 + time * windStrength) * 0.1;
    pos.x += wave * pos.y * 0.5;
    pos.z += wave * pos.y * 0.5;
    
    vHeight = pos.y;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
  `,
  // Fragment Shader
  `
  varying vec2 vUv;
  varying float vHeight;
  uniform vec3 color1;
  uniform vec3 color2;
  
  void main() {
    // Color con degradado de base oscura a punta clara
    vec3 grassColor = mix(color1, color2, vHeight);
    gl_FragColor = vec4(grassColor, 1.0);
  }
  `
);

// Extender React Three Fiber con nuestro material
extend({ GrassShaderMaterial });

export default function Grass({ position = [0, 0, 0], size = 10, density = 5000 }) {
  const ref = useRef();
  const instances = density; // Cantidad de briznas de hierba ajustable

  // Controles en tiempo real con leva
  const controls = useControls("Grass", {
    windStrength: { value: 0.2, min: 0.0, max: 1.0, step: 0.01 },
    size: { value: size, min: 1, max: 50, step: 1 },
    density: { value: density, min: 100, max: 10000, step: 100 },
    positionX: { value: position[0], min: -50, max: 50, step: 0.1 },
    positionY: { value: position[1], min: -18, max: 10, step: 0.1 },
    positionZ: { value: position[2], min: -50, max: 50, step: 0.1 },
  });

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.time = clock.getElapsedTime();
      ref.current.windStrength = controls.windStrength;
    }
  });

  const meshRef = useRef();
  
  // Crear instancias de hierba
  const tempObject = new THREE.Object3D();
  
  useEffect(() => {
    if (meshRef.current) {
      for (let i = 0; i < controls.density; i++) {
        const x = (Math.random() - 0.5) * controls.size + controls.positionX;
        const z = (Math.random() - 0.5) * controls.size + controls.positionZ;
        const y = controls.positionY;
        tempObject.position.set(x, y, z);
        tempObject.rotation.y = Math.random() * Math.PI;
        tempObject.updateMatrix();
        meshRef.current.setMatrixAt(i, tempObject.matrix);
      }
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [controls.density, controls.size, controls.positionX, controls.positionY, controls.positionZ]);
  
  return (
    <instancedMesh ref={meshRef} args={[null, null, controls.density]} castShadow receiveShadow>
      <cylinderGeometry args={[0.02, 0.08, 0.6, 6]} />
      <grassShaderMaterial ref={ref} />
    </instancedMesh>
  );
}
