import React, { createContext, useContext, useRef } from "react";
import { useThree } from "@react-three/fiber";

const CameraManagerContext = createContext();

export const CameraManager = ({ children }) => {
  const { camera, set } = useThree();
  const playerCameraRef = useRef(camera);
  const standCameras = useRef({});

  const registerStandCamera = (standId, camera) => {
    standCameras.current[standId] = camera;
  };

  const activatePlayerCamera = () => {
    set({ camera: playerCameraRef.current });
    playerCameraRef.current.updateProjectionMatrix();
    playerCameraRef.current.updateMatrixWorld();
  };

  const activateStandCamera = (standId) => {
    const standCamera = standCameras.current[standId];
    if (standCamera) {
      set({ camera: standCamera });
      standCamera.updateProjectionMatrix();
    } else {
      console.warn(`No camera registered for stand ID: ${standId}`);
    }
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
