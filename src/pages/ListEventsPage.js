import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../listEventsPage.css";

const ListEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const header = document.querySelector("header");
    if (header) {
      header.style.display = "block";
    }
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await api.get("/events/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if(response.data.length === 1){
          navigate(`/events/${response.data[0].id}?unique=true`); // Redirigir a la página del evento específico
        }

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
    <section className="list-events">
      {events.map((event) => (
        <div key={event.id} className="event-card" >
          <img src={event.image} alt={event.name} />
          <div className="event-info">
            <h2>{event.name}</h2>
            <p>{event.description}</p>
            <button onClick={() => handleSelectEvent(event.id)}>Ir al evento</button>
          </div>
        </div>
      ))}
    </section>
  );
};

export default ListEventsPage;
