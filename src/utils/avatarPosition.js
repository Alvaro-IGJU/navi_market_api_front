// avatarPosition.js

// Define la posición inicial del avatar
export const getAvatarInitialPosition = (eventId) => {
  // Mapa para posiciones según el evento, puedes personalizar según tus necesidades
  const positionMap = {
    1: [0, -1, 15], // Evento 1
  };

  // Devuelve la posición según el evento, o una posición por defecto
  return positionMap[eventId] || [0, -1, 0];
};
