import { useRef } from "react";
import { extend, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";

// Definir el shader del agua sin textura externa
const WaterShaderMaterial = shaderMaterial(
  {
    time: 0,
    resolution: new THREE.Vector2(),
    color: new THREE.Color(0.0, 0.75, 1.0), // Color más celeste (caribeño)
  },
  // Vertex Shader
  `
  varying vec2 vUv;
  uniform float time;
  
  void main() {
    vUv = uv;
    vec3 pos = position;
    pos.z += sin(pos.x * 2.0 + time * 1.0) * 0.05;
    pos.z += cos(pos.y * 2.0 + time * 1.0) * 0.05;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
  `,
  // Fragment Shader
  `
  uniform vec3 color;
  uniform float time;
  varying vec2 vUv;
  
  void main() {
    float wave = sin(vUv.x * 5.0 + time) * 0.05 + cos(vUv.y * 5.0 + time) * 0.05;
    vec3 waterColor = color + wave * 0.05;
    
    // Generar espuma en áreas más visibles
    float noise = fract(sin(dot(vUv * vec2(12.9898,78.233) + time * 0.5, vec2(43758.5453, 43758.5453))));
    float foam = smoothstep(0.6, 1.0, noise) * smoothstep(0.05, 0.15, wave);
    
    vec3 foamColor = mix(waterColor, vec3(1.0, 1.0, 1.0), foam);
    gl_FragColor = vec4(foamColor, mix(0.4, 0.6, foam)); // Transparencia variable con espuma más evidente
  }
  `
);

// Extender React Three Fiber con nuestro material
extend({ WaterShaderMaterial });

export default function Water() {
  const ref = useRef();
  
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.time = clock.getElapsedTime();
    }
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -19.5, 30]} >
      <planeGeometry args={[500, 500, 128, 128]} />
      <waterShaderMaterial ref={ref} transparent={true} />
    </mesh>
  );
}
