import React, { createContext, useState, useContext } from "react";

// Crear el contexto
const CameraFocusContext = createContext();

// Hook para usar el contexto
export const useCameraFocus = () => useContext(CameraFocusContext);

// Proveedor del contexto
export const CameraFocusProvider = ({ children }) => {
  const [focusTarget, setFocusTarget] = useState(null);

  return (
    <CameraFocusContext.Provider value={{ focusTarget, setFocusTarget }}>
      {children}
    </CameraFocusContext.Provider>
  );
};
