// Define posiciones y rotaciones para stands basadas en un índice o posición
export const getStandCoordinates = (position) => {
  // Configuración de posiciones y rotaciones predefinidas
  const standMap = {
    1: { position: [-19.5, -16.2, 6.9], rotation: [0, -0.6, 0], areaRadius: 8 },
    2: { position: [21.0, -16.25, 52.4], rotation: [0, -2.1, 0], areaRadius: 8 },
    3: { position: [-0.2, -16.3, 60.5], rotation: [0, -2.9 , 0], areaRadius: 8 },
    4: { position: [-22.7, -16.25, 51.1], rotation: [0, 2.55, 0], areaRadius: 8 },
    5: { position: [-30, -16.25, 30], rotation: [0, 1.83, 0], areaRadius: 8 },
    6: { position: [6.5, -18, 15.1], rotation: [0, 10.65, 0], areaRadius: 3.2},
    7: { position: [15.4, -18, 24], rotation: [0, 9.8, 0], areaRadius: 3.2},
    8: { position: [15, -18, 37], rotation: [0, 2.75, 0], areaRadius: 3.2},
    9: { position: [5.9, -18, 46], rotation: [0, 1.9, 0], areaRadius: 3.2},
    10: { position: [-6.4, -18, 45], rotation: [0, 1.2, 0], areaRadius: 3.2},
    11: { position: [-15, -18, 36], rotation: [0, 0.4, 0], areaRadius: 3.2},
    12: { position: [-15, -18, 23], rotation: [0, -0.5, 0], areaRadius: 3.2},
    13: { position: [-5.8, -18, 15], rotation: [0, -1.2, 0], areaRadius: 3.2},
    14: { position: [0, -18, 20.5], rotation: [0, -11, 0], areaRadius: 3.2},
    15: { position: [9.6, -18, 30], rotation: [0, -6.3, 0], areaRadius: 3.2},

    16: { position: [0, -18, 40], rotation: [0, -1.6, 0], areaRadius: 2.4},
    17: { position: [-9.7, -18, 29.9], rotation: [0, -3.15, 0], areaRadius: 2.4},

  };

  // Asegúrate de que `position` sea un número
  const index = Number(position);

  // Devuelve las coordenadas y rotaciones correspondientes o un valor por defecto
  return standMap[index] || { position: [0, 0, 0], rotation: [0, 0, 0] };
};
