import React, { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { KeyboardControls, ContactShadows } from "@react-three/drei";
import { CharacterController } from "../CharacterController";
import { CameraManager } from "../CameraManager";
import { Physics, RigidBody } from "@react-three/rapier";
import Joystick from "../Joystick";
import NaviOffice from "./NaviOffice";

const NaviOfficeRoom = () => {
  const isMobile = /Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(
    navigator.userAgent
  );
    const [joystickOffset, setJoystickOffset] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.overflow = "hidden";
    const header = document.querySelector("header");
    if (header) header.style.display = "none";
  }, []);


  return (
    <>
      {/* 🎯 Mantener el Showroom SIEMPRE visible en el fondo */}
      <div style={{ width: "100vw", height: "100vh" }}>
        <KeyboardControls
          map={[
            { name: "forward", keys: ["ArrowUp", "KeyW"] },
            { name: "backward", keys: ["ArrowDown", "KeyS"] },
            { name: "left", keys: ["ArrowLeft", "KeyA"] },
            { name: "right", keys: ["ArrowRight", "KeyD"] },
            { name: "run", keys: ["Shift"] },
          ]}
        >
          <Canvas camera={{ position: [0, 2, 5], fov: 50 }} shadows>
            <CameraManager>
              <Physics>
                {/* 🔥 Mejor iluminación con sombras */}
                <ambientLight intensity={1} />

                {/* 🏭 Machine Room */}
                <NaviOffice scale={[5, 5, 5]}  />

                <CharacterController eventId={'navioffice'} joystickOffset={joystickOffset}/>
              </Physics>

              {/* 🔥 Sombra de contacto suave debajo de los objetos */}
              <ContactShadows position={[0, -0.001, 0]} opacity={0.5} blur={1.5} scale={10} />
            </CameraManager>
          </Canvas>
        </KeyboardControls>
        {isMobile && <Joystick onChange={setJoystickOffset} />}
      </div>

    </>
  );
};

export default NaviOfficeRoom;
