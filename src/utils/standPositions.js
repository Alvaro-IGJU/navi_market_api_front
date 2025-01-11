// Define posiciones y rotaciones para stands basadas en un índice o posición
export const getStandCoordinates = (position) => {
  // Configuración de posiciones y rotaciones predefinidas
  const standMap = {
    // 1: { position: [-25, -0.7, 10], rotation: [0, Math.PI / 4, 0] },
    1: { position: [24, -16.4, 6.5], rotation: [0, -0.5, 0] },
    2: { position: [24.4, -16.4, 55.2], rotation: [0, -2.1, 0] },
    3: { position: [0, -16.4, 64.2], rotation: [0, -2.9 , 0] },
    4: { position: [-24.4, -16.4, 53], rotation: [0, 2.55, 0] },
    5: { position: [-34, -16.4, 30], rotation: [0, 1.83, 0] },
    6: { position: [14.7, -18, 24], rotation: [0, 0.86, 0]},
  };

  // Asegúrate de que `position` sea un número
  const index = Number(position);

  // Devuelve las coordenadas y rotaciones correspondientes o un valor por defecto
  return standMap[index] || { position: [0, 0, 0], rotation: [0, 0, 0] };
};
