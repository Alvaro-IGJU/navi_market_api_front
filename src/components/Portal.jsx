import React, { useRef } from "react";
import { shaderMaterial } from "@react-three/drei";
import { extend, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useNavigate } from "react-router-dom";

// Material shader personalizado para el portal
const PortalShaderMaterial = shaderMaterial(
  {
    uTime: 0.0,
    uColor1: new THREE.Color("#D3BCE3"),
    uColor2: new THREE.Color("#F5E6C4"),
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader
  `
    uniform float uTime;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    varying vec2 vUv;
    
    float random(in vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
    }
    
    float noise(in vec2 st) {
      vec2 i = floor(st);
      vec2 f = fract(st);
      float a = random(i);
      float b = random(i + vec2(1.0, 0.0));
      float c = random(i + vec2(0.0, 1.0));
      float d = random(i + vec2(1.0, 1.0));
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(a, b, u.x) +
             (c - a) * u.y * (1.0 - u.x) +
             (d - b) * u.x * u.y;
    }
    
    void main() {
      vec2 st = vUv * 4.0;
      st.x += sin(st.y * 4.0 + uTime * 0.7) * 0.3;
      st.y += cos(st.x * 4.0 + uTime * 0.7) * 0.3;
      st.x += 0.2 * sin(uTime * 0.3 + st.x * 6.0);
      st.y += 0.2 * cos(uTime * 0.3 + st.y * 6.0);
      float n1 = noise(st + uTime * 0.2);
      float n2 = noise(st * 2.0 - uTime * 0.3);
      float n = mix(n1, n2, 0.5);
      float mask = smoothstep(0.3, 0.55, n);
      vec3 color = mix(uColor1, uColor2, mask);
      gl_FragColor = vec4(color, 1.0);
    }
  `
);

// Extendemos el material para poder usarlo como <portalShaderMaterial />
extend({ PortalShaderMaterial });

const Portal = ({ characterRef, redirectTo, eventId, size, route,  ...props }) => {
  const materialRef = useRef();
  const portalRef = useRef();
  const navigate = useNavigate();
  const threshold = 1.5; // Distancia umbral para el "contacto" con el portal
  const hasNavigated = useRef(false);

  useFrame((state, delta) => {
    // Actualizamos el tiempo del shader para la animación
    if (materialRef.current) {
      materialRef.current.uTime += delta;
    }
    // Si la referencia del personaje y su rigidBody están disponibles, se calcula la distancia
    if (
      characterRef &&
      characterRef.current &&
      characterRef.current.rigidBody &&
      portalRef.current 
    ) {
      const charPos = new THREE.Vector3().copy(characterRef.current.rigidBody.translation());
      const portalPos = new THREE.Vector3().copy(portalRef.current.position);
      const distance = portalPos.distanceTo(charPos);
 
      if (distance < threshold) {
        hasNavigated.current = true; // Evita navegar múltiples veces
        console.log(eventId)
        navigate(route, { state: { eventId } });      }
    }
  });

  return (
    <mesh {...props} ref={portalRef}>
      <planeGeometry args={size} />
      <portalShaderMaterial ref={materialRef} transparent />
    </mesh>
  );
};

export default Portal;
