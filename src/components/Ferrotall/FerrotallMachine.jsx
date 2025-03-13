import React from "react";
import { Html } from "@react-three/drei";
import VurconMachine  from "./VurconMachine";
const FerrotallMachine = ({ position, scale,  rotation, onClick, isSelected }) => {
  return (
      <VurconMachine position={position} onClick={onClick} rotation={rotation} scale={scale}/>
  );
};

export default FerrotallMachine;
