import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import { CapsuleCollider, RigidBody } from "@react-three/rapier";
import Avatar from "./Avatar";
import { AnimatedSprite2D } from "./AnimatedSprite2D";
import { Vector3 } from "three";
import { useControls } from "leva";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { degToRad, MathUtils } from "three/src/math/MathUtils.js";
import { getAvatarInitialPosition } from "../utils/avatarPosition";
import { useCameraManager } from "./CameraManager";

const isMobile = /Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);

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

export const CharacterController = forwardRef(({ eventId = 0, isInteracting = false }, ref) => {
  const WALK_SPEED = isMobile ? 1.2 : 1.8;
  const RUN_SPEED = isMobile ? 2.0 : 2.7;
  const ROTATION_SPEED = isMobile ? 0.2 : 0.03;
  const DRAG_ROTATION_SPEED = isMobile ? 0.03 : 0.02;

  const rb = useRef();
  const container = useRef();
  const character = useRef();
  const { playerCameraRef } = useCameraManager();
  const [animation, setAnimation] = useState("LOLO_Animation_Idle");
  const isDragging = useRef(false);
  const mouseDragStart = useRef(new Vector3());
  const currentMousePosition = useRef(new Vector3());
  const isClicking = useRef(false);
  const movementStarted = useRef(false);

  const characterRotationTarget = useRef(0);
  const rotationTarget = useRef(getAvatarInitialPosition(eventId)["rotation"]);
  const cameraTarget = useRef();
  const cameraPosition = useRef();
  const cameraWorldPosition = useRef(new Vector3());
  const cameraLookAtWorldPosition = useRef(new Vector3());
  const cameraLookAt = useRef(new Vector3());
  const [, get] = useKeyboardControls();

  const initialPosition = getAvatarInitialPosition(eventId)["position"];

  // Exponemos mediante getters para obtener siempre el valor actualizado
  useImperativeHandle(
    ref,
    () => ({
      get character() {
        return character.current;
      },
      get rigidBody() {
        return rb.current;
      },
    }),
    []
  );

  const handleMouseDown = (e) => {
    isDragging.current = true;
    mouseDragStart.current.set(e.clientX, e.clientY, 0);
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    movementStarted.current = false;
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
    const tabletBreakpoint = 1025;
    const onMouseDown = (e) => {
      isClicking.current = true;
    };
    const onMouseUp = (e) => {
      isClicking.current = false;
      movementStarted.current = false;
    };

    if (window.innerWidth > tabletBreakpoint) {
      window.addEventListener("mousedown", handleMouseDown);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("mousemove", handleMouseMove);
      return () => {
        window.removeEventListener("mousedown", handleMouseDown);
        window.removeEventListener("mouseup", handleMouseUp);
        window.removeEventListener("mousemove", handleMouseMove);
      };
    } else {
      document.addEventListener("mousedown", onMouseDown);
      document.addEventListener("mouseup", onMouseUp);
      document.addEventListener("touchstart", onMouseDown);
      document.addEventListener("touchend", onMouseUp);
      return () => {
        document.removeEventListener("mousedown", onMouseDown);
        document.removeEventListener("mouseup", onMouseUp);
        document.removeEventListener("touchstart", onMouseDown);
        document.removeEventListener("touchend", onMouseUp);
      };
    }
  }, []);

  useFrame(({ camera, mouse }) => {
    if (isInteracting) return;

    if (rb.current) {
      const vel = rb.current.linvel();
      const movement = { x: 0, z: 0 };

      if (get().forward) movement.z = 1;
      if (get().backward) movement.z = -1;
      if (get().left) movement.x = 1;
      if (get().right) movement.x = -1;

      let speed = get().run ? RUN_SPEED : WALK_SPEED;

      if (isClicking.current) {
        if (!movementStarted.current) {
          setTimeout(() => {
            movementStarted.current = true;
          }, 200);
        }
        if (movementStarted.current) {
          if (Math.abs(mouse.x) > 0.1) movement.x = -mouse.x;
          movement.z = mouse.y + 0.4;
          if (Math.abs(movement.x) > 0.5 || Math.abs(movement.z) > 0.5)
            speed = RUN_SPEED;
        }
      }

      if (movement.x !== 0) rotationTarget.current += ROTATION_SPEED * movement.x;

      const isCurrentlyMoving = movement.x !== 0 || movement.z !== 0;
      if (isCurrentlyMoving) {
        characterRotationTarget.current = Math.atan2(movement.x, movement.z);
        vel.x = Math.sin(rotationTarget.current + characterRotationTarget.current) * speed;
        vel.z = Math.cos(rotationTarget.current + characterRotationTarget.current) * speed;
        if (animation !== "LOLO_Animation_Walk") {
          setAnimation("LOLO_Animation_Walk");
        }
      } else {
        vel.x = 0;
        vel.z = 0;
        if (animation !== "LOLO_Animation_Idle") {
          setAnimation("LOLO_Animation_Idle");
        }
      }

      rb.current.setLinvel(vel, true);
      character.current.rotation.y = lerpAngle(
        character.current.rotation.y,
        characterRotationTarget.current,
        0.1
      );
    }

    container.current.rotation.y = MathUtils.lerp(
      container.current.rotation.y,
      rotationTarget.current,
      0.1
    );

    if (playerCameraRef.current) {
      cameraPosition.current.getWorldPosition(cameraWorldPosition.current);
      const lerpFactor = isMobile ? 0.5 : 0.5;
      playerCameraRef.current.position.lerp(cameraWorldPosition.current, lerpFactor);
      if (cameraTarget.current) {
        cameraTarget.current.getWorldPosition(cameraLookAtWorldPosition.current);
        cameraLookAt.current.lerp(cameraLookAtWorldPosition.current, lerpFactor);
        playerCameraRef.current.lookAt(cameraLookAt.current);
      }
    }
  });

  const isMoving = movementStarted.current || get().forward || get().backward || get().left || get().right;

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
        <group ref={cameraPosition} position-y={1} position-z={-3} />
        <group ref={character}>
          <Avatar
            ref={ref}
            scale={0.4}
            position-y={-0.38}
            animation={animation}
            pause={!isMoving}
            receiveShadow
            castShadow
          />
        </group>
      </group>
      <CapsuleCollider args={[0.2, 0.18]} />
    </RigidBody>
  );
});
