import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import Header from "../components/Header";

const ListEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await api.get("/events/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setEvents(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error al obtener los eventos:", err);
        setError("No se pudieron cargar los eventos.");
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleSelectEvent = (eventId) => {
    navigate(`/events/${eventId}`); // Redirigir a la página del evento específico
  };

  if (loading) return <p className="text-gray-300">Cargando eventos...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <>
      <Header />
      <div className="container mt-4 text-white">
        <h1 className="text-2xl font-bold mb-4">Lista de Eventos</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-gray-800 p-4 rounded-lg shadow-lg flex flex-col items-center"
            >
              <h2 className="text-xl font-semibold text-[#C7AA68] mb-2">
                {event.name}
              </h2>
              <p className="text-gray-300 mb-4">{event.description}</p>
              <button
                onClick={() => handleSelectEvent(event.id)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
              >
                Seleccionar
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ListEventsPage;
