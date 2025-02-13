// avatarPosition.js

// Define la posición inicial del avatar
export const getAvatarInitialPosition = (eventId) => {
  // Mapa para posiciones según el evento, puedes personalizar según tus necesidades
  const positionMap = {
    0: {"position":[23, 1, 3],
        "rotation": -Math.PI / 2
    }, // Lobby
  //   0: {"position":[0.198, 1, -22.674],
  //     "rotation": -Math.PI / 2
  // }, // Lobby
    2: {"position":[22, -1, 8.5],
      "rotation": -Math.PI / 4
  }, // Evento
 
  };

  // Devuelve la posición según el evento, o una posición por defecto
  return positionMap[eventId] || [0, -1, 0];
};
