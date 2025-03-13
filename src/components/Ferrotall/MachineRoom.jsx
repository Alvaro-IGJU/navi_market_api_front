import React, { useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import { RigidBody } from '@react-three/rapier'

export function MachineRoom({ onLoad, ...props }) {
  const { nodes, materials } = useGLTF('/models/machine_room.glb')

   useEffect(() => {
    useGLTF.preload('/models/machine_room.glb')
   }, [])
   useEffect(() => {
      // Llamamos a la función onLoad cuando se ha cargado el modelo
      if (onLoad) onLoad()
    }, [onLoad])
  return (
    // Con type="fixed" indicamos que es un objeto estático y con colliders="trimesh"
    // se generan colisionadores a partir de la geometría completa.
    <RigidBody type="fixed" colliders="trimesh">
      <group {...props} dispose={null} name="Obstacles">
        <pointLight intensity={16.241}  decay={2} position={[-0.167, 1.286, -0.173]} rotation={[-Math.PI / 2, 0, 0]} scale={[0.345, 0.345, 0.071]} />
        <mesh receiveShadow castShadow geometry={nodes.Viga005.geometry} material={materials['Material.004']} position={[-0.004, 0.698, 1.993]} rotation={[0, -Math.PI / 2, 0]} scale={[0.009, 0.726, 0.055]} />
        <mesh receiveShadow castShadow geometry={nodes.Viga006.geometry} material={materials['Material.004']} position={[-1.946, 0.698, 1.993]} rotation={[0, -Math.PI / 2, 0]} scale={[0.009, 0.726, 0.055]} />
        <mesh receiveShadow castShadow geometry={nodes.Viga009.geometry} material={materials['Material.004']} position={[-1.946, 0.698, -1.981]} rotation={[0, Math.PI / 2, 0]} scale={[0.009, 0.726, 0.055]} />
        <mesh receiveShadow castShadow geometry={nodes.Viga013.geometry} material={materials['Material.004']} position={[-0.004, 0.698, -1.983]} rotation={[0, Math.PI / 2, 0]} scale={[0.009, 0.726, 0.055]} />
        <mesh receiveShadow castShadow geometry={nodes.Viga007.geometry} material={materials['Material.004']} position={[0.988, 1.37, 1.994]} rotation={[Math.PI / 2, 0, Math.PI / 2]} scale={[0.009, 0.93, 0.055]} />
        <mesh receiveShadow castShadow geometry={nodes.Viga008.geometry} material={materials['Material.004']} position={[-0.976, 1.37, 1.994]} rotation={[Math.PI / 2, 0, Math.PI / 2]} scale={[0.009, 0.921, 0.055]} />
        <mesh receiveShadow castShadow geometry={nodes.Viga014.geometry} material={materials['Material.004']} position={[0.988, 1.37, -1.983]} rotation={[Math.PI / 2, 0, -Math.PI / 2]} scale={[0.009, 0.93, 0.055]} />
        <mesh receiveShadow castShadow geometry={nodes.Viga015.geometry} material={materials['Material.004']} position={[-0.976, 1.37, -1.983]} rotation={[Math.PI / 2, 0, -Math.PI / 2]} scale={[0.009, 0.921, 0.055]} />
        <mesh receiveShadow castShadow geometry={nodes.Viga.geometry} material={materials['Material.004']} position={[1.979, 0.698, 0.155]} scale={[0.009, 0.726, 0.055]} />
        <mesh receiveShadow castShadow geometry={nodes.Viga002.geometry} material={materials['Material.004']} position={[1.979, 0.698, 1.942]} scale={[0.009, 0.726, 0.055]} />
        <mesh receiveShadow castShadow geometry={nodes.Viga010.geometry} material={materials['Material.004']} position={[-1.999, 0.698, 0.003]} rotation={[Math.PI, 0, Math.PI]} scale={[0.009, 0.726, 0.055]} />
        <mesh receiveShadow castShadow geometry={nodes.Viga001.geometry} material={materials['Material.004']} position={[1.979, 0.698, -1.932]} scale={[0.009, 0.726, 0.055]} />
        <mesh receiveShadow castShadow geometry={nodes.Viga003.geometry} material={materials['Material.004']} position={[1.979, 1.37, -0.887]} rotation={[Math.PI / 2, 0, 0]} scale={[0.009, 0.98, 0.055]} />
        <mesh receiveShadow castShadow geometry={nodes.Viga004.geometry} material={materials['Material.004']} position={[1.979, 1.37, 1.052]} rotation={[Math.PI / 2, 0, 0]} scale={[0.009, 0.839, 0.055]} />
        <mesh receiveShadow castShadow geometry={nodes.Viga011.geometry} material={materials['Material.004']} position={[-1.984, 1.37, -0.992]} rotation={[Math.PI / 2, 0, Math.PI]} scale={[0.009, 0.945, 0.055]} />
        <mesh receiveShadow castShadow geometry={nodes.Viga012.geometry} material={materials['Material.004']} position={[-1.984, 1.37, 0.997]} rotation={[Math.PI / 2, 0, Math.PI]} scale={[0.009, 0.943, 0.055]} />
        <mesh receiveShadow castShadow geometry={nodes.Plane.geometry} material={materials.Material} scale={2} />
        <mesh receiveShadow castShadow geometry={nodes.Sostenedor.geometry} material={materials['Material.003']} position={[1.884, 0.144, 0.01]} scale={[0.069, 0.015, 0.069]} />
        <mesh receiveShadow castShadow geometry={nodes.Sostenedor001.geometry} material={materials['Material.003']} position={[1.884, 0.144, 0.29]} scale={[0.069, 0.015, 0.069]} />
        <mesh receiveShadow castShadow geometry={nodes.Sostenedor002.geometry} material={materials['Material.003']} position={[1.884, 1.035, 0.01]} scale={[0.069, 0.015, 0.069]} />
        <mesh receiveShadow castShadow geometry={nodes.Sostenedor003.geometry} material={materials['Material.003']} position={[1.884, 1.035, 0.29]} scale={[0.069, 0.015, 0.069]} />
        <mesh receiveShadow castShadow geometry={nodes.Sostenedor004.geometry} material={materials['Material.003']} position={[1.884, 0.579, 0.01]} scale={[0.069, 0.015, 0.069]} />
        <mesh receiveShadow castShadow geometry={nodes.Sostenedor005.geometry} material={materials['Material.003']} position={[1.884, 0.579, 0.29]} scale={[0.069, 0.015, 0.069]} />
        <mesh receiveShadow castShadow geometry={nodes.Tuberia_Horizontal.geometry} material={materials['Material.002']} position={[1.885, 1.221, 0.016]} scale={[0.056, 0.056, 1.863]} />
        <mesh receiveShadow castShadow geometry={nodes.Tuberia_Verical.geometry} material={materials['Material.002']} position={[1.885, 0.52, 0.01]} rotation={[-Math.PI / 2, 0, 0]} scale={[0.056, 0.056, 0.529]} />
        <mesh receiveShadow castShadow geometry={nodes.Tuberia_Vertical.geometry} material={materials['Material.002']} position={[1.885, 0.52, 0.291]} rotation={[-Math.PI / 2, 0, 0]} scale={[0.056, 0.056, 0.529]} />
        <mesh receiveShadow castShadow geometry={nodes.Tuberia_Horizontal001.geometry} material={materials['Material.002']} position={[-1.863, 1.221, 0.016]} scale={[0.056, 0.056, 1.863]} />
        <mesh receiveShadow castShadow geometry={nodes.Sostenedor006.geometry} material={materials['Material.003']} position={[-1.865, 0.144, -1.074]} scale={[0.069, 0.015, 0.069]} />
        <mesh receiveShadow castShadow geometry={nodes.Sostenedor007.geometry} material={materials['Material.003']} position={[-1.865, 0.144, -0.794]} scale={[0.069, 0.015, 0.069]} />
        <mesh receiveShadow castShadow geometry={nodes.Sostenedor008.geometry} material={materials['Material.003']} position={[-1.865, 1.035, -1.074]} scale={[0.069, 0.015, 0.069]} />
        <mesh receiveShadow castShadow geometry={nodes.Sostenedor009.geometry} material={materials['Material.003']} position={[-1.865, 1.035, -0.794]} scale={[0.069, 0.015, 0.069]} />
        <mesh receiveShadow castShadow geometry={nodes.Sostenedor010.geometry} material={materials['Material.003']} position={[-1.865, 0.579, -1.074]} scale={[0.069, 0.015, 0.069]} />
        <mesh receiveShadow castShadow geometry={nodes.Sostenedor011.geometry} material={materials['Material.003']} position={[-1.865, 0.579, -0.794]} scale={[0.069, 0.015, 0.069]} />
        <mesh receiveShadow castShadow geometry={nodes.Sostenedor012.geometry} material={materials['Material.003']} position={[-1.865, 1.221, 1.579]} rotation={[Math.PI / 2, 0, 0]} scale={[0.069, 0.046, 0.069]} />
        <mesh receiveShadow castShadow geometry={nodes.Sostenedor013.geometry} material={materials['Material.003']} position={[1.889, 1.221, 1.579]} rotation={[Math.PI / 2, 0, 0]} scale={[0.069, 0.046, 0.069]} />
        <mesh receiveShadow castShadow geometry={nodes.Sostenedor014.geometry} material={materials['Material.003']} position={[-1.865, 1.221, -1.506]} rotation={[Math.PI / 2, 0, 0]} scale={[0.069, 0.046, 0.069]} />
        <mesh receiveShadow castShadow geometry={nodes.Sostenedor015.geometry} material={materials['Material.003']} position={[1.889, 1.221, -1.506]} rotation={[Math.PI / 2, 0, 0]} scale={[0.069, 0.046, 0.069]} />
        <mesh receiveShadow castShadow geometry={nodes.Sostenedor016.geometry} material={materials['Material.003']} position={[-1.865, 1.221, 0.143]} rotation={[Math.PI / 2, 0, 0]} scale={[0.069, 0.046, 0.069]} />
        <mesh receiveShadow castShadow geometry={nodes.Sostenedor017.geometry} material={materials['Material.003']} position={[1.889, 1.221, 0.143]} rotation={[Math.PI / 2, 0, 0]} scale={[0.069, 0.046, 0.069]} />
        <mesh receiveShadow castShadow geometry={nodes.Tuberia_Verical001.geometry} material={materials['Material.002']} position={[-1.864, 0.52, -1.074]} rotation={[-Math.PI / 2, 0, 0]} scale={[0.056, 0.056, 0.529]} />
        <mesh receiveShadow castShadow geometry={nodes.Tuberia_Vertical001.geometry} material={materials['Material.002']} position={[-1.864, 0.52, -0.793]} rotation={[-Math.PI / 2, 0, 0]} scale={[0.056, 0.056, 0.529]} />
        <mesh receiveShadow castShadow geometry={nodes.Tuberia_Horizontal002.geometry} material={materials['Material.002']} position={[0.01, 1.221, -1.791]} rotation={[0, -Math.PI / 2, 0]} scale={[0.056, 0.056, 1.822]} />
        <mesh receiveShadow castShadow geometry={nodes.Tuberia_Horizontal003.geometry} material={materials['Material.002']} position={[0.01, 1.221, 1.82]} rotation={[0, -Math.PI / 2, 0]} scale={[0.056, 0.056, 1.822]} />
        <mesh receiveShadow castShadow geometry={nodes.Cube008.geometry} material={materials['Material.001']} position={[1.793, 0.489, 0.536]} rotation={[0, Math.PI / 2, 0]} scale={[0.031, 0.56, 0.155]} />
        <mesh receiveShadow castShadow geometry={nodes.Cube009.geometry} material={materials['Material.001']} position={[1.793, 0.489, 1.518]} rotation={[0, Math.PI / 2, 0]} scale={[0.031, 0.56, 0.155]} />
        <mesh receiveShadow castShadow geometry={nodes.Cube010.geometry} material={materials['Material.005']} position={[1.787, 0.901, 1.028]} scale={[0.126, 0.017, 0.508]} />
        <mesh receiveShadow castShadow geometry={nodes.Cube011.geometry} material={materials['Material.005']} position={[1.787, 0.57, 1.028]} scale={[0.126, 0.017, 0.508]} />
        <mesh receiveShadow castShadow geometry={nodes.Cube012.geometry} material={materials['Material.005']} position={[1.787, 0.234, 1.028]} scale={[0.126, 0.017, 0.508]} />
        <mesh receiveShadow castShadow geometry={nodes.Plane001.geometry} material={materials['Material.001']} position={[0.016, 0.006, -1.377]} rotation={[0, Math.PI / 2, 0]} scale={[1.279, 1, 1.225]} />
      </group>
    </RigidBody>
  )
}

export default MachineRoom
