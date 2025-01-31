import React, { useEffect, useRef } from 'react';
import { useGraph } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import { SkeletonUtils } from 'three-stdlib';

export function Avatar({ animation = "rigAction", pause = false, ...props }) {
  const group = useRef();

  // Cargar el modelo y animaciones
  const { scene, animations } = useGLTF('/models/character.glb');
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes, materials } = useGraph(clone);
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    if (actions) {
      // Pausar todas las animaciones inicialmente
      Object.values(actions).forEach((action) => action.stop());
    }
  }, [actions]);

  // Manejo de animaciones
  useEffect(() => {
    if (actions && actions[animation]) {
     
      Object.values(actions).forEach((action) => action.stop()); // Detener todas las animaciones
      if (!pause) {
        actions[animation].reset().fadeIn(0.5).play(); // Reproducir la animación actual
      }
    } 
  }, [animation, pause, actions]);

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group name="esqueleto_corbata" position={[-0.023, 0.71, 0.229]} rotation={[-0.519, 0, 0]} scale={0.233}>
          <primitive object={nodes.Bone} />
          <skinnedMesh name="corbata" geometry={nodes.corbata.geometry} material={materials['Material.001']} skeleton={nodes.corbata.skeleton} />
        </group>
        <group name="rig">
          <primitive object={nodes.c_pos} />
          <primitive object={nodes.c_arms_polel} />
          <primitive object={nodes.c_arms_poler} />
          <primitive object={nodes.c_foot_ikr} />
          <primitive object={nodes.c_leg_poler} />
          <primitive object={nodes.c_foot_ikl} />
          <primitive object={nodes.c_leg_polel} />
          <primitive object={nodes.c_hand_ikr} />
          <primitive object={nodes.c_hand_ikl} />
          <primitive object={nodes.root_refx} />
          <primitive object={nodes.Ctrl_Master} />
          <group name="cabeza004">
            <skinnedMesh name="Cube005" geometry={nodes.Cube005.geometry} material={materials.Cara_Ojo_izquierda} skeleton={nodes.Cube005.skeleton} />
            <skinnedMesh name="Cube005_1" geometry={nodes.Cube005_1.geometry} material={materials.Cara_Ojo_derecho} skeleton={nodes.Cube005_1.skeleton} />
            <skinnedMesh name="Cube005_2" geometry={nodes.Cube005_2.geometry} material={materials.Cara_boca} skeleton={nodes.Cube005_2.skeleton} />
            <skinnedMesh name="Cube005_3" geometry={nodes.Cube005_3.geometry} material={materials.cabeza} skeleton={nodes.Cube005_3.skeleton} />
          </group>
          <group name="cuerpo001">
            <skinnedMesh name="Cylinder004" geometry={nodes.Cylinder004.geometry} material={materials.cuerpo_cabeza} skeleton={nodes.Cylinder004.skeleton} />
            <skinnedMesh name="Cylinder004_1" geometry={nodes.Cylinder004_1.geometry} material={materials.cuerpo_torzo} skeleton={nodes.Cylinder004_1.skeleton} />
          </group>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload('/models/character.glb');