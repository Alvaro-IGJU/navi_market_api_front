import React from "react";
import CameraBorderButton from "./CameraBorderButton";
import KeysMovementButton from "./KeysMovementButton";
import CameraButton from "./CameraButton";
import MicroButton from "./MicroButton";
import ShareScreenButton from "./ShareScreenButton";
import LoloButton from "./LoloButton";
import VolumeButton from "./VolumeButton";
import SettingsButton from "./SettingsButton";

const CanvasInterface = () => {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 1000,
        pointerEvents: "none",
      }}
    >
      <CameraBorderButton />
      <CameraButton />
      <MicroButton />
      <LoloButton />
      <VolumeButton />
      <SettingsButton />
      <ShareScreenButton />
      <KeysMovementButton />
      {/* Agrega aquí más componentes de imagen si es necesario */}
    </div>
  );
};

export default CanvasInterface;
