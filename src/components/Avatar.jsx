import React, { useEffect, useRef, useMemo, useState } from 'react'
import { useGraph } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import { SkeletonUtils } from 'three-stdlib'

const Avatar = React.memo(({ animation = "LOLO_Animation_Idle", pause = false, ...props }) => {
  const group = useRef();
  const [isVisible, setIsVisible] = useState(false); // Para gestionar si el avatar está visible

  // Carga el modelo y sus animaciones; useGLTF cachea internamente la carga
  const { scene, animations } = useGLTF('/models/character.glb');

  // Memoriza el clon del modelo para que solo se realice cuando 'scene' cambie
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);

  // Obtiene nodos y materiales del clon
  const { nodes, materials } = useGraph(clone);

  // Configura las animaciones usando el grupo como referencia
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    if (actions) {
      // Se detienen todas las animaciones inicialmente para evitar ejecuciones innecesarias
      Object.values(actions).forEach((action) => action.stop());
    }
  }, [actions]);

  useEffect(() => {
    if (actions && actions[animation]) {
      // Detenemos todas las acciones activas con un fade out suave
      Object.values(actions).forEach((action) => {
        if (action.isRunning()) {
          action.fadeOut(0.5); // Duración de la transición
        }
      });

      // Reproducimos la nueva animación con un fade in suave
      const newAction = actions[animation];
      let tieAction = []
      if(animation === "LOLO_Animation_Idle"){
         tieAction = actions["Corbata_Animation_Idle"]
      }else if(animation === "LOLO_Animation_Walk"){
         tieAction = actions["Corbata_Animation_walk"]
      }
      newAction.reset().fadeIn(0.1).play(); // Duración de la transición
      tieAction.reset().fadeIn(0.1).play(); // Duración de la transición
    }
  }, [animation, actions]);

  // Agregar un control de visibilidad basado en la distancia con la cámara
  useEffect(() => {
    const checkVisibility = () => {
      if (!group.current) return;
      
      const avatarPosition = group.current.position;
      // Asume que la cámara está en [0, 0, 5]
      const distance = Math.sqrt(
        Math.pow(avatarPosition.x, 2) + Math.pow(avatarPosition.y, 2) + Math.pow(avatarPosition.z - 5, 2)
      );

      if (distance < 10) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    checkVisibility();
    window.addEventListener('resize', checkVisibility); // Recalcular si hay un cambio de tamaño de ventana
    return () => window.removeEventListener('resize', checkVisibility);
  }, []);

  return (
    <group ref={group} {...props} dispose={null} name="chatbot-body" castShadow receiveShadow>
      <group name="Scene">
        <group name="Boca_select">
          <primitive object={nodes.Bone} castShadow receiveShadow />
        </group>
        <group name="Ojo_der_select">
          <primitive object={nodes.Bone_1} castShadow receiveShadow />
        </group>
        <group name="Ojo_izq_select">
          <primitive object={nodes.Bone_2} castShadow receiveShadow />
        </group>
        <group
          name="esqueleto_corbata"
          position={[-0.024, 0.732, 0.291]}
          rotation={[-0.519, 0, 0]}
          scale={0.233}
        >
          <primitive object={nodes.Bone_3} castShadow receiveShadow />
          <skinnedMesh
            name="corbata"
            geometry={nodes.corbata.geometry}
            material={materials['Material.001']}
            skeleton={nodes.corbata.skeleton}
            castShadow
            receiveShadow
          />
        </group>
        <group
          name="circulo_movimiento_general"
          position={[-0.024, 0.732, 0.291]}
          rotation={[-0.519, 0, 0]}
          scale={0.233}
        />
        <group name="rig">
          <primitive object={nodes.c_pos} castShadow receiveShadow />
          <primitive object={nodes.c_arms_polel} castShadow receiveShadow />
          <primitive object={nodes.c_arms_poler} castShadow receiveShadow />
          <primitive object={nodes.c_foot_ikr} castShadow receiveShadow />
          <primitive object={nodes.c_leg_poler} castShadow receiveShadow />
          <primitive object={nodes.c_foot_ikl} castShadow receiveShadow />
          <primitive object={nodes.c_leg_polel} castShadow receiveShadow />
          <primitive object={nodes.c_hand_ikr} castShadow receiveShadow />
          <primitive object={nodes.c_hand_ikl} castShadow receiveShadow />
          <primitive object={nodes.root_refx} castShadow receiveShadow />
          <primitive object={nodes.Ctrl_Master} castShadow receiveShadow />
          <group name="cabeza004">
            <skinnedMesh
              name="Cube005"
              geometry={nodes.Cube005.geometry}
              material={materials.Cara_Ojo_izquierda}
              skeleton={nodes.Cube005.skeleton}
              castShadow
              receiveShadow
            />
            <skinnedMesh
              name="Cube005_1"
              geometry={nodes.Cube005_1.geometry}
              material={materials.Cara_Ojo_derecho}
              skeleton={nodes.Cube005_1.skeleton}
              castShadow
              receiveShadow
            />
            <skinnedMesh
              name="Cube005_2"
              geometry={nodes.Cube005_2.geometry}
              material={materials.Cara_boca}
              skeleton={nodes.Cube005_2.skeleton}
              castShadow
              receiveShadow
            />
            <skinnedMesh
              name="Cube005_3"
              geometry={nodes.Cube005_3.geometry}
              material={materials.cabeza}
              skeleton={nodes.Cube005_3.skeleton}
              castShadow
              receiveShadow
            />
          </group>
          <group name="cuerpo001">
            <skinnedMesh
              name="Cylinder004"
              geometry={nodes.Cylinder004.geometry}
              material={materials.cuerpo_cabeza}
              skeleton={nodes.Cylinder004.skeleton}
              castShadow
              receiveShadow
            />
            <skinnedMesh
              name="Cylinder004_1"
              geometry={nodes.Cylinder004_1.geometry}
              material={materials.cuerpo_torzo}
              skeleton={nodes.Cylinder004_1.skeleton}
              castShadow
              receiveShadow
            />
          </group>
        </group>
      </group>
    </group>
  );
});

export default Avatar;
useGLTF.preload('/models/character.glb');
