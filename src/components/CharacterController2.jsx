import React, { useEffect, useRef, useState, forwardRef } from "react";
import { CapsuleCollider, RigidBody } from "@react-three/rapier";
import { Avatar } from "./Avatar";
import { AnimatedSprite2D } from "./AnimatedSprite2D";
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
  const WALK_SPEED = 1.8;
  const RUN_SPEED = 2.7;
  const ROTATION_SPEED = 0.03;
  const DRAG_ROTATION_SPEED = 0.02;

  const rb = useRef();
  const container = useRef();
  const character = useRef();
  const spriteRef = useRef(); // Referencia al sprite 2D
  const { playerCameraRef } = useCameraManager(); // Obtener la referencia de la cámara del jugador
  const [animation, setAnimation] = useState("LOLO_Animation_Idle");
  const isDragging = useRef(false);
  const mouseDragStart = useRef(new Vector3());
  const currentMousePosition = useRef(new Vector3());
  const isClicking = useRef(false);
  const movementStarted = useRef(false);

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
    movementStarted.current = false; // Reset movement state on mouse up
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
    if (isInteracting) {
      return; // Detener actualizaciones si hay interacción
    }

    if (rb.current) {
      const vel = rb.current.linvel();
      const movement = { x: 0, z: 0 };

      // Detectar teclas de movimiento
      if (get().forward) movement.z = 1;
      if (get().backward) movement.z = -1;
      if (get().left) movement.x = 1;
      if (get().right) movement.x = -1;

      let speed = get().run ? RUN_SPEED : WALK_SPEED;

      // Lógica de clic y movimiento con el mouse
      if (isClicking.current) {
        if (!movementStarted.current) {
          setTimeout(() => {
            movementStarted.current = true;
          }, 200); // Delay antes de iniciar el movimiento
        }

        if (movementStarted.current) {
          if (Math.abs(mouse.x) > 0.1) movement.x = -mouse.x;
          movement.z = mouse.y + 0.4;
          if (Math.abs(movement.x) > 0.5 || Math.abs(movement.z) > 0.5) speed = RUN_SPEED;
        }
      }

      // Manejo del objetivo de rotación
      if (movement.x !== 0) rotationTarget.current += ROTATION_SPEED * movement.x;

      const isCurrentlyMoving = movement.x !== 0 || movement.z !== 0;
      if (isCurrentlyMoving) {
        // Hay movimiento: ajustar velocidad y cambiar a animación de caminar
        characterRotationTarget.current = Math.atan2(movement.x, movement.z);
        vel.x = Math.sin(rotationTarget.current + characterRotationTarget.current) * speed;
        vel.z = Math.cos(rotationTarget.current + characterRotationTarget.current) * speed;

        if (animation !== "LOLO_Animation_Walk") {
          setAnimation("LOLO_Animation_Walk"); // Cambiar a animación de caminar
        }
      } else {
        // No hay movimiento: detener velocidades y cambiar a animación Idle
        vel.x = 0;
        vel.z = 0;

        if (animation !== "LOLO_Animation_Idle") {
          setAnimation("LOLO_Animation_Idle"); // Cambiar a Idle
        }
      }

      // Aplicar la velocidad al cuerpo rígido
      rb.current.setLinvel(vel, true);

      // Ajustar rotación del personaje
      // character.current.rotation.y = lerpAngle(character.current.rotation.y, characterRotationTarget.current, 0.1);
    }

    // Rotación del contenedor principal
    container.current.rotation.y = MathUtils.lerp(container.current.rotation.y, rotationTarget.current, 0.1);

    // Lógica de la cámara
    if (playerCameraRef.current) {
      // Obtener posiciones para la cámara
      cameraPosition.current.getWorldPosition(cameraWorldPosition.current);
      playerCameraRef.current.position.lerp(cameraWorldPosition.current, 0.1);

      if (cameraTarget.current) {
        cameraTarget.current.getWorldPosition(cameraLookAtWorldPosition.current);
        cameraLookAt.current.lerp(cameraLookAtWorldPosition.current, 0.1);
        playerCameraRef.current.lookAt(cameraLookAt.current);
      }
    }

    // Lógica para mantener el sprite mirando hacia la cámara
    if (spriteRef.current) {
      spriteRef.current.lookAt(camera.position);
      spriteRef.current.rotation.y += Math.PI; // Rotar 180 grados para corregir la orientación
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
        <group ref={cameraPosition} position-y={1.5} position-z={-4} />
        <group ref={character}>
          {/* <Avatar
            scale={0.4}
            position-y={-0.25}
            animation={animation}
            pause={!isMoving} // Pausar si no hay movimiento
          /> */}
          <AnimatedSprite2D
            ref={spriteRef} // Referencia al sprite para manipulación
            textureUrl="/sprites/sprite_character_32px.png"
            rows={4}
            cols={4}
            frameRate={8}
            scale={1.5}
            position={[0, 0.5, 0]} // Ajusta la posición según el mapa
            
          />
        </group>
      </group>
      <CapsuleCollider args={[0.2, 0.18]} />
    </RigidBody>
  );
});
