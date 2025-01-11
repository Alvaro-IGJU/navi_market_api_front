// Define posiciones y rotaciones para stands basadas en un índice o posición
export const getStandCoordinates = (position) => {
  // Configuración de posiciones y rotaciones predefinidas
  const standMap = {
    1: { position: [24, -16.4, 6.5], rotation: [0, -0.5, 0] },
    2: { position: [24.4, -16.4, 55.2], rotation: [0, -2.1, 0] },
    3: { position: [0, -16.4, 64.2], rotation: [0, -2.9 , 0] },
    4: { position: [-24.4, -16.4, 53], rotation: [0, 2.55, 0] },
    5: { position: [-34, -16.4, 30], rotation: [0, 1.83, 0] },
    6: { position: [6, -18, 15], rotation: [0, 2.81, 0]},
    7: { position: [14.7, -18, 24], rotation: [0, 1.86, 0]},
    8: { position: [15, -18, 36], rotation: [0, 1.16, 0]},
    9: { position: [-7, -18, 44.1], rotation: [0, -0.4, 0]},
    10: { position: [-15, -18, 36], rotation: [0, -1, 0]},
    11: { position: [-14.5, -18, 22.9], rotation: [0, -2.1, 0]},
    12: { position: [-5.8, -18, 15], rotation: [0, -2.8, 0]},
    13: { position: [5.6, -18, 20.8], rotation: [0, 2.58, 0]},
    14: { position: [10, -18, 26.4], rotation: [0, 1.88, 0]},
    15: { position: [9.6, -18, 34.5], rotation: [0, 1.18, 0]},
    16: { position: [4.0, -18, 39], rotation: [0, 0.71, 0]},
    17: { position: [-4.8, -18, 39], rotation: [0, -0.4, 0]},
    18: { position: [-9.5, -18, 34.5], rotation: [0, -1.2, 0]},
    19: { position: [-10, -18, 25.0], rotation: [0, -2.1, 0]},
    20: { position: [-3.2, -18, 19.0], rotation: [0, -2.8, 0]},
    21: { position: [0.5, -18, 24.2], rotation: [0, 0, 0]},
    22: { position: [5.5, -18, 30], rotation: [0, -1.6, 0]},
    23: { position: [-0.6, -18, 35.6], rotation: [0, -3.1, 0]},
    24: { position: [-5.8, -18, 29.0], rotation: [0, -3.1, 0]},
  };

  // Asegúrate de que `position` sea un número
  const index = Number(position);

  // Devuelve las coordenadas y rotaciones correspondientes o un valor por defecto
  return standMap[index] || { position: [0, 0, 0], rotation: [0, 0, 0] };
};
