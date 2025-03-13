import React, { useState, useEffect, useRef } from 'react';
import { useFrame, extend } from '@react-three/fiber';
import { Vector3, MathUtils } from 'three';
import Avatar from './Avatar';
import { Text, Billboard } from '@react-three/drei';
import { useSocket } from '../contexts/SocketContext';

// Funciones para interpolar ángulos suavemente
const normalizeAngle = (angle) => {
  while (angle > Math.PI) angle -= 2 * Math.PI;
  while (angle < -Math.PI) angle += 2 * Math.PI;
  return angle;
};

const lerpAngle = (start, end, t) => {
  start = normalizeAngle(start);
  end = normalizeAngle(end);
  // Si la diferencia es mayor a Pi, ajustamos para evitar saltos
  if (Math.abs(end - start) > Math.PI) {
    if (end > start) {
      start += 2 * Math.PI;
    } else {
      end += 2 * Math.PI;
    }
  }
  return normalizeAngle(start + (end - start) * t);
};

const OtherPlayers = () => {
  const socket = useSocket();
  const [players, setPlayers] = useState({});
  const [clientId, setClientId] = useState(null);
  // Referencia a los grupos internos (que contienen el avatar)
  const avatarRefs = useRef({});

  useEffect(() => {
    if (!socket) return;
    
    const updateClientId = () => {
      const id = socket.id;
      if (id) {
        setClientId(id);
        console.log("Socket connected, clientId:", id);
      }
    };

    if (socket.id) {
      updateClientId();
    }
    socket.on("connect", updateClientId);
    
    const handlePlayerUpdate = (data) => {
      const currentId = clientId || socket.id;
      if (data.id === currentId) {
        console.log("Ignoring own update:", data);
        return;
      }
      // console.log("playerUpdate received:", data);
      setPlayers(prev => ({
        ...prev,
        [data.id]: {
          position: new Vector3(...data.position),
          rotation: data.rotation,
          animation: data.animation || "LOLO_Animation_Idle",
          username: data.username || 'Unknown'
        },
      }));
    };

    const handlePlayerDisconnected = (data) => {
      console.log("playerDisconnected received:", data);
      setPlayers(prev => {
        const newPlayers = { ...prev };
        if (newPlayers[data.id]) {
          console.log(`Removing player ${data.id} from state.`);
          delete newPlayers[data.id];
          delete avatarRefs.current[data.id];
        }
        return newPlayers;
      });
    };

    socket.on("playerUpdate", handlePlayerUpdate);
    socket.on("playerDisconnected", handlePlayerDisconnected);

    return () => {
      socket.off("connect", updateClientId);
      socket.off("playerUpdate", handlePlayerUpdate);
      socket.off("playerDisconnected", handlePlayerDisconnected);
    };
  }, [socket, clientId]);

  // Actualiza la rotación del grupo interno (avatar) de cada jugador usando lerpAngle
  useFrame(() => {
    Object.entries(players).forEach(([id, data]) => {
      const avatarGroup = avatarRefs.current[id];
      if (avatarGroup) {
        avatarGroup.rotation.y = lerpAngle(avatarGroup.rotation.y, data.rotation, 0.1);
      }
    });
  });

  return (
    <>
      {Object.entries(players).map(([id, data]) => {
        const currentId = clientId || socket?.id;
        if (id === currentId) return null;
        return (
          // Grupo contenedor posicionado según la posición del jugador
          <group key={id} position={[data.position.x, data.position.y, data.position.z]}>
            {/* Grupo interno para el avatar, al que se le actualiza la rotación */}
            <group
              ref={el => {
                if (el) {
                  avatarRefs.current[id] = el;
                }
              }}
            >
              <Avatar
                position={[0, 0, 0]}
                rotation={[0, 0, 0]}
                animation={data.animation || "LOLO_Animation_Idle"}
                pause={false}
                scale={0.4}
              />
            </group>
            {/* Texto con Billboard para mostrar el username sin afectar la rotación */}
            <Billboard follow={true} lockX lockY lockZ>
              <Text
                position={[0, 0.8, 0]} // Ajusta este offset según la altura del avatar
                fontSize={0.2}
                color="black"
                anchorX="center"
                anchorY="bottom"
              >
                {data.username}
              </Text>
            </Billboard>
          </group>
        );
      })}
    </>
  );
};

export default OtherPlayers;
