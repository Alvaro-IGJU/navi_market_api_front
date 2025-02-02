// Define posiciones y rotaciones para stands basadas en un índice o posición
export const getStandCoordinates = (position) => {
  // Configuración de posiciones y rotaciones predefinidas
  const standMap = {
    1: { position: [-19.5, -16.23, 7.6], rotation: [0, -0.6, 0], areaRadius: 8 },
    2: { position: [21.3, -16.44, 52], rotation: [0, -2.1, 0], areaRadius: 8 },
    3: { position: [0.09, -16.44, 60.5], rotation: [0, -2.9 , 0], areaRadius: 8 },
    4: { position: [-21.95, -16.44, 50.9], rotation: [0, 2.55, 0], areaRadius: 8 },
    5: { position: [-30.3, -16.43, 30.3], rotation: [0, 1.83, 0], areaRadius: 8 },
    6: { position: [6.66, -18, 14.66], rotation: [0, 10.67, 0], areaRadius: 3},
    7: { position: [15.65, -17.9, 24.14], rotation: [0, 9.8, 0], areaRadius: 3},
    8: { position: [15.36, -17.96, 36.49], rotation: [0, 2.82, 0], areaRadius: 3},
    9: { position: [5.75, -17.99, 45.68], rotation: [0, 1.87, 0], areaRadius: 3},
    10: { position: [-5.85, -17.99, 45.43], rotation: [0, 1.17, 0], areaRadius: 3},
    11: { position: [-15.3, -17.96, 35.85], rotation: [0, 0.35, 0], areaRadius: 3},
    12: { position: [-15.35 ,-17.795, 24.15], rotation: [0, -0.42, 0], areaRadius: 3},
    13: { position: [-5.75, -18.05, 14.63], rotation: [0, -1.23, 0], areaRadius: 3},
    14: { position: [-0.15, -17.94, 20.21], rotation: [0, -11, 0], areaRadius: 3},
    15: { position: [9.87, -17.94, 30], rotation: [0, -6.28, 0], areaRadius: 3},

    16: { position: [-0.07, -18, 39.8], rotation: [0, -1.6, 0], areaRadius: 3},
    17: { position: [-9.95, -17.94, 29.9], rotation: [0, -3.15, 0], areaRadius: 3},

  };

  // Asegúrate de que `position` sea un número
  const index = Number(position);

  // Devuelve las coordenadas y rotaciones correspondientes o un valor por defecto
  return standMap[index] || { position: [0, 0, 0], rotation: [0, 0, 0] };
};
