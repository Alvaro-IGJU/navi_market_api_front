import React, { useState, useRef } from "react";

const Joystick = ({ onChange }) => {
  const joystickRef = useRef(null);
  const [active, setActive] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  
  // Reducir el valor para disminuir la sensibilidad.
  const scaleFactor = 0.01; // Valor menor = menos sensibilidad.
  
  // Estos valores se usan para la lógica interna.
  const invertX = -1; 
  const invertY = -1; 

  const handlePointerDown = (e) => {
    e.preventDefault();
    setActive(true);
    const pointer = e.touches ? e.touches[0] : e;
    setStartPos({ x: pointer.clientX, y: pointer.clientY });
  };

  const handlePointerMove = (e) => {
    if (!active) return;
    const pointer = e.touches ? e.touches[0] : e;
    const rawOffset = {
      x: pointer.clientX - startPos.x,
      y: pointer.clientY - startPos.y,
    };
    const newOffset = {
      x: rawOffset.x * scaleFactor * invertX,
      y: rawOffset.y * scaleFactor * invertY,
    };
    setOffset(newOffset);
    if (onChange) onChange(newOffset);
  };

  const handlePointerUp = () => {
    setActive(false);
    setOffset({ x: 0, y: 0 });
    if (onChange) onChange({ x: 0, y: 0 });
  };

  return (
    <div
      ref={joystickRef}
      style={{
        position: "absolute",
        bottom: "20px",
        left: "20px",
        width: "100px",
        height: "100px",
        background: "rgba(0,0,0,0.3)",
        borderRadius: "50%",
        touchAction: "none",
        userSelect: "none",
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <div
        style={{
          position: "absolute",
          left: `calc(50% - ${offset.x * 30}px - 25px)`,
          top: `calc(50% - ${offset.y * 30}px - 25px)`,
          width: "50px",
          height: "50px",
          background: "rgba(255,255,255,0.6)",
          borderRadius: "50%",
        }}
      />
    </div>
  );
};

export default Joystick;
