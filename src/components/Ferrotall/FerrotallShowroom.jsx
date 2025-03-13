import React, { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { KeyboardControls, ContactShadows } from "@react-three/drei";
import { CharacterController } from "../CharacterController";
import { CameraManager } from "../CameraManager";
import { Physics, RigidBody } from "@react-three/rapier";
import FerrotallMachine from "./FerrotallMachine";
import MachineRoom from "./MachineRoom";
import MachineBlueprintView from "./MachineBlueprintView"; // Nueva vista
import Joystick from "../Joystick";
import LoadingScreen from "../LoadingScreen";

const FerrotallShowroom = () => {
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [lobbyLoaded, setLobbyLoaded] = useState(false);
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

  useEffect(() => {
    if (selectedMachine) {
      document.body.style.cursor = "grab";
    } else if (hovered) {
      document.body.style.cursor = "pointer";
    } else {
      document.body.style.cursor = "auto";
    }
  }, [selectedMachine, hovered]);

  return (
    <>
      {/* 🎯 Mantener el Showroom SIEMPRE visible en el fondo */}
      <div style={{ width: "100vw", height: "100vh" }}>
        <LoadingScreen isLoading={!lobbyLoaded} />

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
                <ambientLight intensity={0.3} />
                
                

                {/* 🏢 Suelo con sombras */}
                <RigidBody type="fixed">
                  <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                    <planeGeometry args={[20, 20]} />
                    <shadowMaterial opacity={0.4} />
                  </mesh>
                </RigidBody>

                {/* 🏭 Machine Room */}
                <MachineRoom scale={[2, 2, 2]} rotation={[0, -3.9, 0]} onLoad={() => setLobbyLoaded(true)} />

                {/* 🏗️ Máquina con sombras */}
                <RigidBody type="fixed">

                <FerrotallMachine 
                  position={[-1.7, 0.55, 1.7]} 
                  scale={[0.75, 0.75, 0.75]}
                  castShadow
                  onClick={() => setSelectedMachine({
                    name: "Torno de bancada paralela Vurcon PL-50x2000",
                    models: ["PL50 750", "PL50 1000", "PL50 1500", "PL50 2000"],
                    specifications:[
                      {
                        "category": "Capacidad de trabajo",
                        "specifications": [
                          { "label": "Distancia entre puntos", "unit": "mm", "values": [750, 1000, 1500, 2000] },
                          { "label": "Max. volteo sobre la bancada", "unit": "mm", "values": ["ø510"] },
                          { "label": "Max. volteo sobre el carro", "unit": "mm", "values": ["ø290"] },
                          { "label": "Max. diámetro torneado", "unit": "mm", "values": [500] },
                          { "label": "Max. longitud torneado", "unit": "mm", "values": [670, 920, 1420, 1920] },
                          { "label": "Paso de barra", "unit": "mm", "values": ["ø80"] }
                        ]
                      },
                      {
                        "category": "Cabezal",
                        "specifications": [
                          { "label": "Potencia motor principal", "unit": "Kw", "values": ["11/15"] },
                          { "label": "Agujero cónico del husillo", "unit": "", "values": ["ø90,1:20"] },
                          { "label": "Agujero del husillo", "unit": "mm", "values": ["ø82"] },
                          { "label": "Nariz del husillo", "unit": "", "values": ["A2-8"] },
                          { "label": "Velocidad del husillo", "unit": "r/min", "values": [2500] }
                        ]
                      },
                      {
                        "category": "Ejes X y Z",
                        "specifications": [
                          { "label": "Avances rápido eje X/Z", "unit": "m/min", "values": ["4/8"] },
                          { "label": "X-Husillo bolas", "unit": "ø/paso", "values": ["ø25/5"] },
                          { "label": "Z-Husillo bolas", "unit": "ø/paso", "values": ["ø40/10"] },
                          { "label": "Distancia entre guías X/Z", "unit": "mm", "values": ["210/390"] },
                          { "label": "Recorrido en X", "unit": "mm", "values": [250] }
                        ]
                      },
                      {
                        "category": "Contrapunto",
                        "specifications": [
                          { "label": "Diám. de la caña", "unit": "mm", "values": [75] },
                          { "label": "Recorrido de la caña", "unit": "mm", "values": [150] },
                          { "label": "Cono morse caña", "unit": "", "values": ["CM5"] }
                        ]
                      },
                      {
                        "category": "Torreta",
                        "specifications": [
                          { "label": "Posiciones torreta estándar", "unit": "", "values": ["6 (8 OPCIONAL)"] },
                          { "label": "Dimensiones de la hta.", "unit": "mm", "values": ["25x25"] },
                          { "label": "Diámetro porta hta. interiores", "unit": "mm", "values": ["ø25"] }
                        ]
                      },
                      {
                        "category": "Medidas",
                        "specifications": [
                          { "label": "Dimensiones (LxAnxAlt)", "unit": "m", "values": ["2,85", "3,1", "3,6", "4,1"] },
                          { "label": "Peso", "unit": "Kg", "values": [2400, 2500, 2750, 3500] }
                        ]
                      }
                    ],
                    videoUrl: "https://www.youtube.com/embed/L5rD1cIOTxo?si=l9V3SrxSkf1DBKZY"
                  })} 
                  onPointerOver={() => setHovered(true)}
                  onPointerOut={() => setHovered(false)}
                  rotation={[0, 0.8, 0]}
                />
                                </RigidBody>

                {lobbyLoaded && !selectedMachine && <CharacterController eventId={1000} joystickOffset={joystickOffset}/>}
              </Physics>

              {/* 🔥 Sombra de contacto suave debajo de los objetos */}
              <ContactShadows position={[0, -0.001, 0]} opacity={0.5} blur={1.5} scale={10} />
            </CameraManager>
          </Canvas>
        </KeyboardControls>
        {isMobile && <Joystick onChange={setJoystickOffset} />}

      </div>

      {/* 🟢 MachineBlueprintView como POPUP sobre el showroom */}
      {selectedMachine && (
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "rgba(0, 0, 0, 0.4)", // Oscurece ligeramente para resaltar el popup
          backdropFilter: "blur(3px)", // Da un efecto ligero de desenfoque
          zIndex: 1000
        }}>
          <MachineBlueprintView selectedMachine={selectedMachine} onClose={() => setSelectedMachine(null)} />
        </div>
      )}
    </>
  );
};

export default FerrotallShowroom;
