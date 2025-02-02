import React, { useState, useEffect } from "react";

const TotalScore = () => {
  const [score, setScore] = useState(null);

  // Generar un número aleatorio entre 60 y 100 cuando el componente se monta
  useEffect(() => {
    const randomScore = Math.floor(Math.random() * 41) + 60; // Número entre 60 y 100
    setScore(randomScore);
  }, []);

  return (
    <div
      className="p-4 rounded-lg flex flex-col items-center justify-center"
      style={{
        minWidth: "200px",
        maxWidth: "300px",
        textAlign: "center",
      }}
    >
      <h2 className="text-lg font-bold text-black">Puntuación Total</h2>
      {score === null ? (
        <p className="text-gray-300">Cargando...</p>
      ) : (
        <p className="text-xl font-bold text-orange-600">{score}</p>
      )}
    </div>
  );
};

export default TotalScore;
