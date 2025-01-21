import React from "react";
import { RigidBody, CuboidCollider } from "@react-three/rapier";

const BoundedArea = ({ width = 10, depth = 10, height = 5, position = [0, 0, 0] }) => {
  return (
    <>
      {/* Pared frontal */}
      <RigidBody type="fixed">
        <CuboidCollider
          args={[width / 2, height / 2, 0.05]}
          position={[position[0], position[1] + height / 2, position[2] - depth / 2]}
        />
      </RigidBody>

      {/* Pared trasera */}
      <RigidBody type="fixed">
        <CuboidCollider
          args={[width / 2, height / 2, 0.05]}
          position={[position[0], position[1] + height / 2, position[2] + depth / 2]}
        />
      </RigidBody>

      {/* Pared izquierda */}
      <RigidBody type="fixed">
        <CuboidCollider
          args={[0.05, height / 2, depth / 2]}
          position={[position[0] - width / 2, position[1] + height / 2, position[2]]}
        />
      </RigidBody>

      {/* Pared derecha */}
      <RigidBody type="fixed">
        <CuboidCollider
          args={[0.05, height / 2, depth / 2]}
          position={[position[0] + width / 2, position[1] + height / 2, position[2]]}
        />
      </RigidBody>
    </>
  );
};

export default BoundedArea;
