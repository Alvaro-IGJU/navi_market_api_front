import React, { useEffect, useRef, useState, forwardRef } from "react";
import { CapsuleCollider, RigidBody } from "@react-three/rapier";
import { Avatar } from "./Avatar";
import { Vector3 } from "three";
import { useControls } from "leva";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { degToRad, MathUtils } from "three/src/math/MathUtils.js";
import { getAvatarInitialPosition } from "../utils/avatarPosition";
import { useCameraManager } from "./CameraManager";

const normalizeAngle = (angle) => {
  while (angle > Math.PI) angle -= 2 * Math.PI;
  while (angle < -Math.PI) angle += 2 * Math.PI;
  return angle;
};

const lerpAngle = (start, end, t) => {
  start = normalizeAngle(start);
  end = normalizeAngle(end);

  if (Math.abs(end - start) > Math.PI) {
    if (end > start) {
      start += 2 * Math.PI;
    } else {
      end += 2 * Math.PI;
    }
  }

  return normalizeAngle(start + (end - start) * t);
};

export const CharacterController = forwardRef(({ eventId = 1, isInteracting = false }, ref) => {
  const { WALK_SPEED, RUN_SPEED, ROTATION_SPEED, DRAG_ROTATION_SPEED } = useControls("Character Control", {
    WALK_SPEED: { value: 0.8, min: 0.1, max: 4, step: 0.1 },
    RUN_SPEED: { value: 1.6, min: 0.2, max: 12, step: 0.1 },
    ROTATION_SPEED: {
      value: degToRad(0.5),
      min: degToRad(0.1),
      max: degToRad(5),
      step: degToRad(0.1),
    },
    DRAG_ROTATION_SPEED: {
      value: degToRad(1),
      min: degToRad(0.1),
      max: degToRad(10),
      step: degToRad(0.1),
    },
  });

  const rb = useRef();
  const container = useRef();
  const character = useRef();
  const { playerCameraRef } = useCameraManager(); // Obtener la referencia de la cámara del jugador
  const [animation, setAnimation] = useState("Idle");
  const isDragging = useRef(false);
  const mouseDragStart = useRef(new Vector3());
  const currentMousePosition = useRef(new Vector3());

  const characterRotationTarget = useRef(0);
  const rotationTarget = useRef(0);
  const cameraTarget = useRef();
  const cameraPosition = useRef();
  const cameraWorldPosition = useRef(new Vector3());
  const cameraLookAtWorldPosition = useRef(new Vector3());
  const cameraLookAt = useRef(new Vector3());
  const [, get] = useKeyboardControls();

  const initialPosition = getAvatarInitialPosition(eventId);

  const handleMouseDown = (e) => {
    isDragging.current = true;
    mouseDragStart.current.set(e.clientX, e.clientY, 0);
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseMove = (e) => {
    if (isDragging.current) {
      currentMousePosition.current.set(e.clientX, e.clientY, 0);

      const deltaX = currentMousePosition.current.x - mouseDragStart.current.x;
      rotationTarget.current += DRAG_ROTATION_SPEED * deltaX * 0.17;

      mouseDragStart.current.copy(currentMousePosition.current);
    }
  };

  useEffect(() => {
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useFrame(({ camera }) => {
    if (isInteracting) {
      return; // Detener actualizaciones si hay interacción
    }

    if (rb.current) {
      const vel = rb.current.linvel();
      const movement = { x: 0, z: 0 };

      if (get().forward) movement.z = 1;
      if (get().backward) movement.z = -1;

      let speed = get().run ? RUN_SPEED : WALK_SPEED;

      if (get().left) movement.x = 1;
      if (get().right) movement.x = -1;

      if (movement.x !== 0) rotationTarget.current += ROTATION_SPEED * movement.x;

      if (movement.x !== 0 || movement.z !== 0) {
        characterRotationTarget.current = Math.atan2(movement.x, movement.z);
        vel.x = Math.sin(rotationTarget.current + characterRotationTarget.current) * speed;
        vel.z = Math.cos(rotationTarget.current + characterRotationTarget.current) * speed;
        setAnimation("Walking");
      } else {
        setAnimation("Idle");
      }

      character.current.rotation.y = lerpAngle(character.current.rotation.y, characterRotationTarget.current, 0.1);
      rb.current.setLinvel(vel, true);
    }

    container.current.rotation.y = MathUtils.lerp(container.current.rotation.y, rotationTarget.current, 0.1);

    if (playerCameraRef.current) {
      cameraPosition.current.getWorldPosition(cameraWorldPosition.current);
      playerCameraRef.current.position.lerp(cameraWorldPosition.current, 0.1);

      if (cameraTarget.current) {
        cameraTarget.current.getWorldPosition(cameraLookAtWorldPosition.current);
        cameraLookAt.current.lerp(cameraLookAtWorldPosition.current, 0.1);
        playerCameraRef.current.lookAt(cameraLookAt.current);
      }
    }
  });

  return (
    <RigidBody
      colliders={false}
      lockRotations
      ref={rb}
      name="Character"
      position={initialPosition}
    >
      <group ref={container}>
        <group ref={cameraTarget} position-z={1.5} />
        <group ref={cameraPosition} position-y={1} position-z={-2} />
        <group ref={character}>
          <Avatar scale={0.4} position-y={-0.25} animation={animation} />
        </group>
      </group>
      <CapsuleCollider args={[0.2, 0.18]} />
    </RigidBody>
  );
});
