import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle, useContext } from "react";
import { CapsuleCollider, RigidBody } from "@react-three/rapier";
import Avatar from "./Avatar";
import { Vector3, Quaternion, Euler, MathUtils } from "three";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { getAvatarInitialPosition } from "../utils/avatarPosition";
import { useCameraManager } from "./CameraManager";
import { useSocket } from "../contexts/SocketContext";
import { AuthContext } from "../contexts/AuthContext";
import { LocalPlayerContext } from "../contexts/LocalPlayerContext";

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

export const CharacterController = forwardRef(
  ({ eventId = 0, isInteracting = false, joystickOffset = { x: 0, y: 0 } }, ref) => {
    const WALK_SPEED = isMobile ? 1.2 : 3;
    const RUN_SPEED = isMobile ? 2.0 : 2.7;
    const ROTATION_SPEED = isMobile ? 0.1 : 0.03;

    const rb = useRef();
    const container = useRef();
    const character = useRef();
    const { playerCameraRef } = useCameraManager();
    const [animation, setAnimation] = useState("LOLO_Animation_Idle");
    const [, get] = useKeyboardControls();

    const characterRotationTarget = useRef(0);
    const rotationTarget = useRef(getAvatarInitialPosition(eventId)["rotation"]);
    const cameraTarget = useRef();
    const cameraPosition = useRef();
    const cameraWorldPosition = useRef(new Vector3());
    const cameraLookAtWorldPosition = useRef(new Vector3());
    const cameraLookAt = useRef(new Vector3());
    const initialPosition = getAvatarInitialPosition(eventId)["position"];

    const socket = useSocket();
    const lastEmitRef = useRef(Date.now());

    // Extraemos el usuario del AuthContext
    const { user } = useContext(AuthContext);

    // Extraemos el setter de posición local del LocalPlayerContext
    const { setPosition: setLocalPosition } = useContext(LocalPlayerContext);

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

    useFrame(() => {
      if (isInteracting) return;

      if (rb.current) {
        const vel = rb.current.linvel();
        const movement = { x: 0, z: 0 };

        // Entrada de teclado para desktop.
        if (get().forward) movement.z += 1;
        if (get().backward) movement.z -= 1;
        if (get().left) movement.x += 1;
        if (get().right) movement.x -= 1;

        // Entrada del joystick para móviles.
        if (isMobile && joystickOffset) {
          movement.x += joystickOffset.x;
          movement.z += joystickOffset.y;
        }

        let speed = get().run ? RUN_SPEED : WALK_SPEED;
        if (Math.abs(movement.x) > 0.5 || Math.abs(movement.z) > 0.5) speed = RUN_SPEED;

        // Actualizamos la rotación objetivo según la dirección.
        if (movement.x !== 0) rotationTarget.current += ROTATION_SPEED * movement.x;

        const isCurrentlyMoving = movement.x !== 0 || movement.z !== 0;
        if (isCurrentlyMoving) {
          const targetRotation = Math.atan2(movement.x, movement.z);
          characterRotationTarget.current = targetRotation;
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
        const lerpFactor = 0.5;
        playerCameraRef.current.position.lerp(cameraWorldPosition.current, lerpFactor);
        if (cameraTarget.current) {
          cameraTarget.current.getWorldPosition(cameraLookAtWorldPosition.current);
          cameraLookAt.current.lerp(cameraLookAtWorldPosition.current, lerpFactor);
          playerCameraRef.current.lookAt(cameraLookAt.current);
        }
      }

      // Emitir actualización al servidor (throttled).
      const now = Date.now();
      if (socket && now - lastEmitRef.current > 10 && character.current) {
        lastEmitRef.current = now;
        const pos = new Vector3();
        character.current.getWorldPosition(pos);
        pos.y -= 0.4;
        const quaternion = new Quaternion();
        character.current.getWorldQuaternion(quaternion);
        const euler = new Euler().setFromQuaternion(quaternion, "YXZ");
        const rot = euler.y;

        socket.emit("updatePlayer", {
          eventId,
          position: pos.toArray(),
          rotation: rot,
          animation,
          username: user ? user.username : undefined,
        });

        // Actualizar la posición local en el contexto para el chat de voz
        setLocalPosition(pos);
      }
    });

    const isMoving =
      get().forward ||
      get().backward ||
      get().left ||
      get().right ||
      (joystickOffset && (joystickOffset.x !== 0 || joystickOffset.y !== 0));

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
              position-y={-0.4}
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
  }
);
