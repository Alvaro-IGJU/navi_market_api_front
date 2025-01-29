import React, { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

const GradientBackground = () => {
  const { scene } = useThree();

  useEffect(() => {
    const gradientShader = new THREE.ShaderMaterial({
      uniforms: {
        topColor: { value: new THREE.Color("#87CEEB") }, // Azul celeste
        bottomColor: { value: new THREE.Color("#FFD700") }, // Amarillo dorado
        time: { value: 0 }, // Tiempo para animación
      },
      vertexShader: `
        varying vec3 vWorldPosition;
        void main() {
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * viewMatrix * worldPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 topColor;
        uniform vec3 bottomColor;
        uniform float time;
        varying vec3 vWorldPosition;
        void main() {
          float minY = -50.0;
          float maxY = 50.0;
          float height = (vWorldPosition.y - minY) / (maxY - minY);
          height = clamp(height, 0.0, 1.0);

          vec3 animatedTop = mix(topColor, vec3(0.5 + 0.5 * sin(time), 0.5, 1.0), 0.5);
          vec3 animatedBottom = mix(bottomColor, vec3(1.0, 0.5 + 0.5 * sin(time), 0.5), 0.5);

          vec3 color = mix(animatedBottom, animatedTop, height);
          gl_FragColor = vec4(color, 1.0);
        }
      `,
      side: THREE.BackSide,
      depthWrite: false,
    });

    const gradientCube = new THREE.BoxGeometry(1, 1, 1);
    const gradientMesh = new THREE.Mesh(gradientCube, gradientShader);
    gradientMesh.scale.set(200, 200, 200);
    scene.add(gradientMesh);

    // Animar con incremento más lento
    const animate = () => {
      gradientShader.uniforms.time.value += 0.002; // Incremento más lento
      requestAnimationFrame(animate);
    };
    animate();

    return () => {
      scene.remove(gradientMesh);
    };
  }, [scene]);

  return null;
};

export default GradientBackground;
