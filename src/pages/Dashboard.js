import React from "react";
import Header from "../components/Header";
import EventInteractionsChart from "../components/EventInteractionsChart";

const Dashboard = () => {
  const eventId = 1; // ID del evento actual

  return (
    <>
      <Header />
      <div className="container mt-4">
        <h1 className="text-2xl font-bold mb-4">Bienvenido al Dashboard</h1>
        <p className="mb-4">Aquí encontrarás tus estadísticas y actividades.</p>

        {/* Sección de estadísticas */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-[#C7AA68]">
            Interacciones por Empresa
          </h2>
          <EventInteractionsChart eventId={eventId} />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
