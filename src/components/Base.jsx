import React from 'react'
import { useGLTF } from '@react-three/drei'
import { RigidBody } from '@react-three/rapier'

function Base(props) {
  const { nodes, materials } = useGLTF('/models/base.glb')
  return (
    <group {...props} dispose={null}>
      <RigidBody type="fixed" name="ground" colliders="trimesh">
        <mesh geometry={nodes.Cube.geometry} material={materials.BRONCE} position={[0, 0, 18.422]} />
        <mesh geometry={nodes.Cube001.geometry} material={materials.BRONCE} position={[0, 0, -18.401]} rotation={[-Math.PI, 0.014, -Math.PI]} />
        <mesh geometry={nodes.Cube002.geometry} material={materials.BRONCE} position={[-18.478, 0, -0.238]} rotation={[0, -1.571, 0]} />
        <mesh geometry={nodes.Cube003.geometry} material={materials.BRONCE} position={[18.486, 0, -0.238]} rotation={[0, Math.PI / 2, 0]} />
        <mesh geometry={nodes.Cube004.geometry} material={materials.BRONCE} position={[13.56, 0, 12.675]} rotation={[0, 0.81, 0]} />
        <mesh geometry={nodes.Cube005.geometry} material={materials.BRONCE} position={[-13.295, 0, -12.913]} rotation={[Math.PI, -0.806, Math.PI]} />
        <mesh geometry={nodes.Cube007.geometry} material={materials.BRONCE} position={[13.536, 0, -12.517]} rotation={[-Math.PI, 0.834, -Math.PI]} />
        <mesh geometry={nodes.Cube008.geometry} material={materials.BRONCE} position={[-13.311, 0, 13.003]} rotation={[0, -0.794, 0]} />
        <mesh geometry={nodes.Cylinder_1.geometry} material={materials['Material.001']} />
        <mesh geometry={nodes.Cylinder_2.geometry} material={materials['Material.002']} />
        <mesh geometry={nodes.Cylinder_3.geometry} material={materials['Material.003']} />
      </RigidBody>
    </group>
  )
}

export default Base; // Asegúrate de exportar por defecto

useGLTF.preload('/models/base.glb')
