// Define posiciones y rotaciones para stands basadas en un índice o posición
export const getStandCoordinates = (position) => {
  // Configuración de posiciones y rotaciones predefinidas
  const standMap = {
    // 1: { position: [-25, -0.7, 10], rotation: [0, Math.PI / 4, 0] },
    1: { position: [-23, -18, 20.3], rotation: [0, 0.86, 0] },
    2: { position: [0.5, -18, 63], rotation: [0, 3.14, 0] },
    3: { position: [30, -18, 34], rotation: [0, Math.PI / -2, 0] },
    4: { position: [23, -18, 57], rotation: [0, 4, 0] },
    5: { position: [-23, -18, 57], rotation: [0, 2.5, 0] },
  };

  // Asegúrate de que `position` sea un número
  const index = Number(position);

  // Devuelve las coordenadas y rotaciones correspondientes o un valor por defecto
  return standMap[index] || { position: [0, 0, 0], rotation: [0, 0, 0] };
};
