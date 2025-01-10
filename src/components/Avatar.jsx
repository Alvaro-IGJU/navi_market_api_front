import React, { useEffect, useRef } from 'react';
import { useGraph } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import { SkeletonUtils } from 'three-stdlib';

export function Avatar({ animation, ...props }) {
  const group = useRef();
  const { scene, animations } = useGLTF('/models/character.glb'); // Carga el modelo GLB con animaciones
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes, materials } = useGraph(clone);
  const { actions } = useAnimations(animations, group); // Usa animaciones

  // Mostrar animaciones disponibles para depuración
  useEffect(() => {
    if (animations) {
      console.log('Animaciones disponibles:', animations.map((anim) => anim.name));
    }
  }, [animations]);

  // Manejo de animaciones
  useEffect(() => {
    if (actions && actions[animation]) {
      console.log(`Reproduciendo animación: ${animation}`);
      Object.values(actions).forEach((action) => action.stop()); // Detener todas las animaciones activas
      actions[animation].reset().fadeIn(0.5).play(); // Reproducir la animación actual
    } else {
      console.warn(`No se encontró la animación: ${animation}`);
    }
    return () => {
      if (actions && actions[animation]) {
        actions[animation].fadeOut(0.5); // Detener la animación al desmontar
      }
    };
  }, [animation, actions]);

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group name="rig">
          <primitive object={nodes.root} />
          <primitive object={nodes['MCH-torsoparent']} />
          <primitive object={nodes['MCH-hand_ikparentL']} />
          <primitive object={nodes['MCH-upper_arm_ik_targetparentL']} />
          <primitive object={nodes['MCH-hand_ikparentR']} />
          <primitive object={nodes['MCH-upper_arm_ik_targetparentR']} />
          <primitive object={nodes['MCH-foot_ikparentL']} />
          <primitive object={nodes['MCH-thigh_ik_targetparentL']} />
          <primitive object={nodes['MCH-foot_ikparentR']} />
          <primitive object={nodes['MCH-thigh_ik_targetparentR']} />
        </group>
        <group name="Faceselect">
          <primitive object={nodes.Bone} />
        </group>
        <mesh name="brazo002" geometry={nodes.brazo002.geometry} material={materials.cuerpo_cabeza} />
        <group name="cabeza001">
          <mesh name="Cube001" geometry={nodes.Cube001.geometry} material={materials.cuerpo_cabeza} />
          <mesh name="Cube001_1" geometry={nodes.Cube001_1.geometry} material={materials.cara_ojos} />
          <mesh name="Cube001_2" geometry={nodes.Cube001_2.geometry} material={materials.cara_boca} />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload('/models/character.glb');
