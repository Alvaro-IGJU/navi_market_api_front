import React, { createContext, useContext, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { Vector3 } from "three";

const CameraManagerContext = createContext();

export const CameraManager = ({ children }) => {
  const { camera, set } = useThree();
  const playerCameraRef = useRef(camera);
  const standCameras = useRef({});
  const animationIdRef = useRef(null); // Para manejar la animación de acercamiento

  const registerStandCamera = (standId, camera) => {
    standCameras.current[standId] = camera;
  };

  const activatePlayerCamera = () => {
    if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current); // Cancelar cualquier animación previa
    set({ camera: playerCameraRef.current });
    playerCameraRef.current.updateProjectionMatrix();
    playerCameraRef.current.updateMatrixWorld();
  };

  const activateStandCamera = (standId) => {
    const standCamera = standCameras.current[standId];
    if (standCamera) {
      set({ camera: standCamera });
      animateCameraApproach(standCamera);
      standCamera.updateProjectionMatrix();
    } else {
      console.warn(`No camera registered for stand ID: ${standId}`);
    }
  };

  const animateCameraApproach = (targetCamera) => {
    const startPosition = targetCamera.position.clone().add(new Vector3(0, 0, 1)); // Inicia desde atrás
    const endPosition = targetCamera.position.clone();
    const duration = 0.1; // Duración de la animación en segundos
    let startTime = null;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = (timestamp - startTime) / 1000; // Tiempo transcurrido en segundos

      const t = Math.min(elapsed / duration, 1); // Progresión normalizada (0 a 1)

      // Interpolación hacia la posición final
      targetCamera.position.lerpVectors(startPosition, endPosition, t);
      targetCamera.updateMatrixWorld();

      if (t < 1) {
        animationIdRef.current = requestAnimationFrame(animate);
      } else {
        animationIdRef.current = null;
      }
    };

    targetCamera.position.copy(startPosition); // Configura la posición inicial
    targetCamera.updateMatrixWorld();
    animationIdRef.current = requestAnimationFrame(animate);
  };

  return (
    <CameraManagerContext.Provider
      value={{
        playerCameraRef,
        registerStandCamera,
        activatePlayerCamera,
        activateStandCamera,
      }}
    >
      {children}
    </CameraManagerContext.Provider>
  );
};

export const useCameraManager = () => {
  return useContext(CameraManagerContext);
};
