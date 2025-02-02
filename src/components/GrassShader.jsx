import * as THREE from 'three';
import { useFrame, useLoader } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import { TextureLoader } from 'three';

const GrassShaderMaterial = () => {
  const texture = useLoader(TextureLoader, '/textures/grass_texture.png');
  const materialRef = useRef();

  console.log("Texture loaded:", texture);

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = clock.getElapsedTime();
    }
  });

  return (
    <shaderMaterial
      ref={materialRef}
      attach="material"
      uniforms={{
        time: { value: 0 },
        texture: { value: texture },
      }}
      vertexShader={`
        uniform float time;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec3 pos = position;
          pos.x += sin(pos.y * 4.0 + time * 2.0) * 0.1;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `}
      fragmentShader={`
        uniform sampler2D texture;
        varying vec2 vUv;
        void main() {
          gl_FragColor = texture2D(texture, vUv);
          if (gl_FragColor.a < 0.1) discard;
        }
      `}
    />
  );
};

const Grass = () => {
  const count = 1000;
  const meshRef = useRef();
  
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(() => {
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 10;
      const z = (Math.random() - 0.5) * 10;
      dummy.position.set(x, 0, z);
      dummy.rotation.y = Math.random() * Math.PI;
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <planeGeometry args={[0.2, 1, 10, 10]} />
      <GrassShaderMaterial />
    </instancedMesh>
  );
};

export { GrassShaderMaterial, Grass };