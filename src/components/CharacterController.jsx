import { useEffect, useRef, useState } from "react";
import { CapsuleCollider, RigidBody } from "@react-three/rapier";
import { Avatar } from "./Avatar";
import {Vector3} from "three";
import {useControls} from "leva";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { degToRad, MathUtils } from "three/src/math/MathUtils.js";

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


export const CharacterController = () => {
  
    const {WALK_SPEED, RUN_SPEED, ROTATION_SPEED} = useControls("Character Control", {
        WALK_SPEED: { value: 0.8, min: 0.1, max: 4, step: 0.1 },
        RUN_SPEED: { value: 1.6, min: 0.2, max: 12, step: 0.1 },
        ROTATION_SPEED: {
            value: degToRad(0.5),
            min: degToRad(0.1),
            max: degToRad(5),
            step: degToRad(0.1),
        }
    });

  const rb = useRef();
  const container = useRef();
  const character = useRef(); 

  const [animation, setAnimation] = useState("Idle");


  const characterRotationTarget = useRef(0);
  const rotationTarget = useRef(0);
  const cameraTarget = useRef();
  const cameraPosition = useRef();
  const cameraWorldPosition = useRef(new Vector3());
  const cameraLookAtWorldPosition = useRef(new Vector3());
  const cameraLookAt = useRef(new Vector3());
  const [, get] = useKeyboardControls();
  const isClicking = useRef(false);

  useEffect(() => {
    const onMouseDown = (e) => {
        isClicking.current = true;
    };
    const onMouseUp = (e) => {
        isClicking.current = true;
    };
    // document.addEventListener("mousedown", onMouseDown);
    // document.addEventListener("mouseup", onMouseUp);

    // document.addEventListener("touchstart", onMouseUp);
    // document.addEventListener("touchend", onMouseUp);

    return () => {
        // document.removeEventListener("mousedown", onMouseDown);
        // document.removeEventListener("mouseup", onMouseDown);

        // document.removeEventListener("touchstart", onMouseUp);
        // document.removeEventListener("touchend", onMouseUp);

    }
  })  

  useFrame(({camera, mouse}) => {

    if(rb.current){
        const vel = rb.current.linvel();

        const movement = {
            x: 0,
            z: 0,
        };

        if(get().forward){
            movement.z  = 1;
        }
        if(get().backward){
            movement.z  = -1;
        }
        
        let speed = get().run ? RUN_SPEED : WALK_SPEED;


        if(isClicking.current){
            if(Math.abs(mouse.x) > 0.1) {
                movement.x = -mouse.x;
            }
            movement.z = mouse.y + 0.4;

            if(Math.abs(movement.x) > 0.5 || Math.abs(movement.z) > 0.5){
                speed = RUN_SPEED;
            }
        }

        if(get().left){
            movement.x = 1;
        }
        if(get().right){
            movement.x = -1;
        }

        if(movement.x !== 0){
            rotationTarget.current += ROTATION_SPEED * movement.x;
        }

        if(movement.x !== 0 || movement.z !== 0){

            characterRotationTarget.current = Math.atan2(movement.x, movement.z);
            vel.x = Math.sin(rotationTarget.current + characterRotationTarget.current) * speed;
            vel.z = Math.cos(rotationTarget.current + characterRotationTarget.current) * speed;
            if(speed === RUN_SPEED){
                setAnimation("Walking")
            }else{
                setAnimation("Walking")
            }

        }else{
            setAnimation("Idle")

        }

        character.current.rotation.y = lerpAngle(
            character.current.rotation.y, 
            characterRotationTarget.current,
            0.1
        );

        rb.current.setLinvel(vel, true);

    }

    // CAMERA 
    container.current.rotation.y = MathUtils.lerp(
        container.current.rotation.y,
        rotationTarget.current,
        0.1
    )

    cameraPosition.current.getWorldPosition(cameraWorldPosition.current);
    camera.position.lerp(cameraWorldPosition.current, 0.1);

    if (cameraTarget.current) {
        cameraTarget.current.getWorldPosition(cameraLookAtWorldPosition.current);
        cameraLookAt.current.lerp(cameraLookAtWorldPosition.current, 0.1);

        camera.lookAt(cameraLookAt.current);
    }

  })

  return (
    <RigidBody colliders={false} lockRotations ref={rb} name="Character">
      <group ref={container}>
        {/* Referencia para el objetivo de la cámara */}
        <group ref={cameraTarget} position-z={1.5} />

        {/* Referencia para la posición de la cámara */}
        <group ref={cameraPosition} position-y={1} position-z={-2} />

        {/* Referencia para el personaje */}
        <group ref={character} >
          <Avatar scale={0.3} position-y={-0.25} animation={animation} />
        </group>
      </group>

      {/* Collider en forma de cápsula para el personaje */}
      <CapsuleCollider args={[0.08, 0.15]} />
    </RigidBody>
  );
};
