import React from 'react';
import Header from '../components/Header'; // Ajusta la ruta según tu estructura de carpetas

const Dashboard = () => {
  return (
    <>
      <Header /> {/* Importa e incluye el Header */}
      <div className="container mt-4">
        <h1>Bienvenido al Dashboard</h1>
        <p>Aquí encontrarás tus estadísticas y actividades.</p>
      </div>
    </>
  );
};

export default Dashboard;
