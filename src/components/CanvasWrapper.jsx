import React, { useEffect, useRef, useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { KeyboardControls, ContactShadows } from "@react-three/drei";
import { useLocation } from "react-router-dom";
import Lobby from "./Lobby";
import { Physics } from "@react-three/rapier";
import { CharacterController } from "./CharacterController";
import { CameraManager } from "./CameraManager";
import Portal from "./Portal";
import OtherPlayers from "./OtherPlayers";
import LoadingScreen from "./LoadingScreen";
// import { useSocket } from "../contexts/SocketContext";
import Joystick from "./Joystick";
import CanvasInterface from "./CanvasInterface/CanvasInterface";
import VoiceChatManager from "./VoiceChatManager"; // Importar el manager de voz

const keyboardMap = [
  { name: "forward", keys: ["ArrowUp", "KeyW"] },
  { name: "backward", keys: ["ArrowDown", "KeyS"] },
  { name: "left", keys: ["ArrowLeft", "KeyA"] },
  { name: "right", keys: ["ArrowRight", "KeyD"] },
  { name: "run", keys: ["Shift"] },
];

const OrientationWarning = () => {
  return (
    <div className="orientation-warning">
      <p>Para una mejor experiencia, gira tu dispositivo a horizontal.</p>
      <style jsx>{`
        .orientation-warning {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.8);
          color: white;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
          text-align: center;
          padding: 20px;
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
};

const CanvasWrapper = () => {
  const location = useLocation();
  const [eventId, setEventId] = useState(undefined);
  const [lobbyLoaded, setLobbyLoaded] = useState(false);
  const characterRef = useRef();
  const mainLightRef = useRef();
  const spotLightRef = useRef();
  // const socket = useSocket();
  const [joystickOffset, setJoystickOffset] = useState({ x: 0, y: 0 });

  // Detecta la orientación del dispositivo
  const [isPortrait, setIsPortrait] = useState(window.innerHeight > window.innerWidth);
  const isMobile = /Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(
    navigator.userAgent
  );

  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.overflow = "hidden";
    const header = document.querySelector("header");
    if (header) header.style.display = "none";
  }, []);

  useEffect(() => {
    if (eventId !== undefined) return;
    setEventId(0);
  }, [eventId]);

  useEffect(() => {
    if (mainLightRef.current) {
      mainLightRef.current.shadow.radius = 10;
      mainLightRef.current.shadow.bias = -0.0002;
    }
  }, []);

  useEffect(() => {
    if (spotLightRef.current) {
      spotLightRef.current.target.position.set(-9.5, 0, 2.58);
    }
  }, []);

  // useEffect(() => {
  //   if (socket && eventId !== undefined) {
  //     socket.emit("joinEvent", { eventId });
  //   }
  // }, [socket, eventId]);

  useEffect(() => {
    const handleResize = () => {
      const portrait = window.innerHeight > window.innerWidth;
      setIsPortrait(portrait);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const lockOrientation = async () => {
      if (window.screen.orientation && window.screen.orientation.lock) {
        try {
          await window.screen.orientation.lock("landscape");
          console.log("Orientación bloqueada a horizontal");
        } catch (error) {
          console.error("No se pudo bloquear la orientación:", error);
        }
      }
    };
    window.addEventListener("click", lockOrientation, { once: true });
    return () => window.removeEventListener("click", lockOrientation);
  }, []);

  if (isPortrait) {
    return <OrientationWarning />;
  }

  return (
    <div className="fullscreen-canvas">
      <LoadingScreen isLoading={!lobbyLoaded} />
      <KeyboardControls map={keyboardMap}>
        <div
          id="canvas-container"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            overflow: "hidden",
          }}
        >
          <Canvas
            camera={{ position: [0, 0.5, 5], fov: 42 }}
            style={{ touchAction: "none", width: "100%", height: "100%" }}
            shadows
            gl={{ antialias: true }}
          >
            <CameraManager>
              <ambientLight intensity={1} color="#ffd8b1" />
              <hemisphereLight intensity={1.2} skyColor="#ffe4c4" groundColor="#a0522d" />
              <group rotation={[5, Math.PI / 30, 0]}>
                <directionalLight
                  ref={mainLightRef}
                  position={[23, 2, 7]}
                  intensity={3}
                  color="#ffcc99"
                  castShadow
                  shadow-mapSize-width={4096}
                  shadow-mapSize-height={4096}
                  shadow-camera-near={0.1}
                  shadow-camera-far={50}
                  shadow-camera-left={-50}
                  shadow-camera-right={50}
                  shadow-camera-top={50}
                  shadow-camera-bottom={-50}
                  shadow-bias={-0.01}
                />
              </group>
              <group rotation={[0, Math.PI / -6, 0]}>
                <directionalLight position={[-9, 1, 1]} intensity={3} color="#ffcc99" />
              </group>
              <group rotation={[0, Math.PI / 3, 0]}>
                <directionalLight position={[-9, 1, 1]} intensity={4} color="#ffcc99" />
              </group>
              <group rotation={[0, -Math.PI / 1, 0]}>
                <directionalLight position={[-9, 1, 1]} intensity={1.5} color="#ffcc99" />
              </group>
             
              {/* {socket && <OtherPlayers socket={socket} />} */}
              <Physics>
                <group>
                  <Suspense fallback={null}>
                    <Lobby position={[0, 0, 0]} onLoad={() => setLobbyLoaded(true)} />
                    <Portal
                      position={[-17.5, 1.2, 2.58]}
                      rotation={[0, Math.PI / 2, 0]}
                      characterRef={characterRef}
                      eventId={2}
                      size={[3, 3]}
                      route={"/canvas/event"}
                    />
                    <Portal
                      position={[-10.85, 0.8, -3.4]}
                      rotation={[0, Math.PI / 200, 0]}
                      characterRef={characterRef}
                      eventId={eventId}
                      size={[2.5, 2.1]}
                      route={"/landing"}
                    />
                  </Suspense>
                </group>
                {lobbyLoaded && (
                  <CharacterController
                    ref={characterRef}
                    eventId={eventId}
                    joystickOffset={joystickOffset}
                  />
                )}
                <ContactShadows
                  position={[0, -0.1, 0]}
                  opacity={0.5}
                  scale={10}
                  blur={2}
                  far={10}
                />
              </Physics>
            </CameraManager>
          </Canvas>
          {/* Se añade la interfaz sobre el canvas */}
          {/* <CanvasInterface /> */}
        </div>
      </KeyboardControls>
      {isMobile && <Joystick onChange={setJoystickOffset} />}
      {/* Incluir el gestor de chat de voz */}
    </div>
  );
};

export default CanvasWrapper;
