import React, { createContext, useState } from "react";
import { Vector3 } from "three";

export const LocalPlayerContext = createContext();

export const LocalPlayerProvider = ({ children }) => {
  const [position, setPosition] = useState(new Vector3(0, 0, 0));
  return (
    <LocalPlayerContext.Provider value={{ position, setPosition }}>
      {children}
    </LocalPlayerContext.Provider>
  );
};
