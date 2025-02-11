import React, { useRef, useEffect } from "react";
import * as THREE from "three";

const UpwardSpotLight = ({
  position = [0, 0.5, 0],     // Posición por defecto del foco
  targetPosition = [0, 5, 0],   // Posición por defecto del target (hacia dónde apunta)
  ...rest
}) => {
  const spotRef = useRef();
  const targetRef = useRef();

  useEffect(() => {
    if (spotRef.current && targetRef.current) {
      // Asigna el objeto target al spotlight para que apunte hacia él
      spotRef.current.target = targetRef.current;
    }
  }, []);

  return (
    <>
      <spotLight
        ref={spotRef}
        castShadow
        position={position}
        angle={Math.PI / 3}
        intensity={1.5}
        penumbra={0.3}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        {...rest} // Permite sobrescribir u agregar otras propiedades vía props
      />
      {/* Objeto que define hacia dónde apunta la luz */}
      <object3D ref={targetRef} position={targetPosition} />
    </>
  );
};

export default UpwardSpotLight;
