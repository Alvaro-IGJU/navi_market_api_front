// import { shaderMaterial } from "@react-three/drei";
// import { resolveLygia } from "resolve-lygia";
// import { Color } from "three";

// export const WaterMaterial = shaderMaterial(
//   {
//     uColor: new Color("skyblue"),
//     uOpacity: 0.8,
//     uTime: 0,
//     uSpeed: 0.5,
//     uRepeat: 40.0, // Aumentar la repetición para más detalle
//     uNoiseType: 0,
//     uFoam: 0.3, // Reducir para espuma más definida
//     uFoamTop: 0.6, // Reducir la transición de la espuma
//     uDepth: null,
//     uMaxDepth: 1.0,
//     uResolution: [0, 0],
//     uCameraNear: 0,
//     uCameraFar: 0,
//   },
//   /* glsl */ `
//   varying vec2 vUv;
//   void main() {
//     vUv = uv;
//     gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
//   }`,
//   resolveLygia(/* glsl */ `
//     #include "lygia/generative/pnoise.glsl"
//     #include "lygia/generative/voronoise.glsl"

//     varying vec2 vUv;
//     uniform vec3 uColor;
//     uniform float uOpacity;
//     uniform float uTime;
//     uniform float uSpeed;
//     uniform float uRepeat;
//     uniform int uNoiseType;
//     uniform float uFoam;
//     uniform float uFoamTop;
//     uniform sampler2D uDepth;
//     uniform float uMaxDepth;
//     uniform vec2 uResolution;
//     uniform float uCameraNear;
//     uniform float uCameraFar;

//     float getViewZ(const in float depth, const in float near, const in float far) {
//       return (near * far) / (far - depth * (far - near));
//     }

//     float getDepth(const in vec2 screenPosition) {
//       return texture2D(uDepth, screenPosition).r;
//     }

//     void main() {
//       float adjustedTime = uTime * uSpeed;

//       // Noise Generation
//       float noise = 0.0;
//       if (uNoiseType == 0) {
//         noise = pnoise(vec3(vUv * uRepeat, adjustedTime), vec3(100.0, 24.0, 112.0)); // Aumentar frecuencia
//       } else if (uNoiseType == 1) {
//         vec2 p = 0.5 - 0.5 * cos(adjustedTime * vec2(1.0, 0.5));
//         p = p * p * (3.0 - 2.0 * p);
//         noise = voronoise(vec3(vUv * uRepeat, adjustedTime), p.x, 1.0);
//       }

//       // Depth Handling
//       vec2 screenUV = gl_FragCoord.xy / uResolution;
//       float fragmentLinearEyeDepth = getViewZ(gl_FragCoord.z, uCameraNear, uCameraFar);
//       float linearEyeDepth = getViewZ(getDepth(screenUV), uCameraNear, uCameraFar);

//       float depthDifference = fragmentLinearEyeDepth - linearEyeDepth;
//       float depthEffect = smoothstep(uMaxDepth * 0.8, 0.0, depthDifference); // Reducir suavizado

//       // Foam
//       float foam = smoothstep(uFoam, uFoamTop, noise + depthEffect * 1.2); // Ajustar mezcla para más nitidez

//       // Final Color Computation
//       vec3 foamColor = vec3(1.0); // White foam
//       vec3 lighterWaterColor = uColor * 1.6; // Make water color brighter
//       vec3 waterColor = mix(lighterWaterColor, uColor, noise * 0.7); // Mezcla más definida
//       vec3 finalColor = mix(foamColor, waterColor, foam);

//       gl_FragColor = vec4(finalColor, uOpacity);
//     }`)
// );
