import { useFBO } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import { useRef } from "react";
import {
  Color,
  FloatType,
  MeshDepthMaterial,
  NoBlending,
  RGBADepthPacking,
} from "three";

// Configuración del material de profundidad
const depthMaterial = new MeshDepthMaterial({
  depthPacking: RGBADepthPacking,
  blending: NoBlending,
  transparent: false,
});

export const Water = ({ ...props }) => {
  const waterMaterialRef = useRef();
  const waterRef = useRef();

  // Controles interactivos
  const {
    waterColor,
    waterOpacity,
    speed,
    noiseType,
    foam,
    foamTop,
    repeat,
    maxDepth,
  } = useControls({
    waterOpacity: { value: 0.8, min: 0, max: 1 },
    waterColor: "#00c3ff",
    speed: { value: 0.5, min: 0, max: 5 },
    repeat: {
      value: 30,
      min: 1,
      max: 100,
    },
    foam: {
      value: 0.4,
      min: 0,
      max: 1,
    },
    foamTop: {
      value: 0.7,
      min: 0,
      max: 1,
    },
    noiseType: {
      value: 0,
      options: {
        Perlin: 0,
        Voronoi: 1,
      },
    },
    maxDepth: { value: 2, min: 0, max: 5 },
  });

  const renderTarget = useFBO({
    depth: true,
    type: FloatType,
  });

  useFrame(({ gl, scene, camera, clock }) => {
    // Ocultar la malla de agua y renderizar el buffer de profundidad
    waterRef.current.visible = false;
    gl.setRenderTarget(renderTarget);
    scene.overrideMaterial = depthMaterial;
    gl.render(scene, camera);

    // Restaurar la escena y mostrar la malla de agua
    scene.overrideMaterial = null;
    waterRef.current.visible = true;
    gl.setRenderTarget(null);

    // Configurar los uniformes del material del agua
    if (waterMaterialRef.current) {
      waterMaterialRef.current.uniforms.uTime.value = clock.getElapsedTime();
      waterMaterialRef.current.uniforms.uDepth.value = renderTarget.texture;
      const pixelRatio = gl.getPixelRatio();
      waterMaterialRef.current.uniforms.uResolution.value = [
        window.innerWidth * pixelRatio,
        window.innerHeight * pixelRatio,
      ];
      waterMaterialRef.current.uniforms.uCameraNear.value = camera.near;
      waterMaterialRef.current.uniforms.uCameraFar.value = camera.far;
    }
  });

  return (
    <mesh {...props} ref={waterRef}>
      <planeGeometry args={[300, 300]} />
      <waterMaterial
        ref={waterMaterialRef}
        uColor={new Color(waterColor)}
        transparent={true} // Mantiene la transparencia habilitada
        depthWrite={false} // Deshabilita la escritura de profundidad
        depthTest={true} // Permite respetar el fondo
        uOpacity={waterOpacity}
        uNoiseType={noiseType}
        uSpeed={speed}
        uRepeat={repeat}
        uFoam={foam}
        uFoamTop={foamTop}
        uMaxDepth={maxDepth}
      />
    </mesh>
  );
};
