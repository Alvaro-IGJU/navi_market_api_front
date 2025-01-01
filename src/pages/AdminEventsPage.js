import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import '../adminEventsPage.css';

const AdminEventsPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    name: '',
    start_date: '',
    end_date: '',
    description: '',
    image: '',
    max_stands: 10,
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!user?.is_superuser) {
      navigate('/');
      return;
    }

    const fetchEvents = async () => {
      try {
        const response = await api.get('/events/');
        setEvents(response.data);
      } catch (error) {
        console.error('Error al cargar eventos:', error);
        setMessage('Error al cargar eventos.');
      }
    };

    fetchEvents();
  }, [user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setNewEvent((prevData) => ({ ...prevData, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('No estás autenticado.');

      await api.post('/events/create/', newEvent, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      setMessage('Evento creado con éxito.');
      setNewEvent({
        name: '',
        start_date: '',
        end_date: '',
        description: '',
        image: '',
        max_stands: 10,
      });
    } catch (error) {
      console.error('Error al crear el evento:', error);
      setMessage(error.response?.data?.detail || 'Error al crear el evento.');
    }
  };

  const handleDelete = async (eventId) => {
    setMessage('');
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('No estás autenticado.');

      await api.delete(`/events/${eventId}/delete/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));
      setMessage('Evento eliminado con éxito.');
    } catch (error) {
      console.error('Error al eliminar el evento:', error);
      setMessage(error.response?.data?.detail || 'Error al eliminar el evento.');
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-container">
        <h1 className="admin-title">Gestión de Eventos</h1>
        {message && <p className="message">{message}</p>}

        <h2 className="section-title">Crear Nuevo Evento</h2>
        <form onSubmit={handleEventSubmit} className="form-group">
          <div className="form-field">
            <label>Nombre del Evento</label>
            <input
              type="text"
              name="name"
              value={newEvent.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-field">
            <label>Fecha de Inicio</label>
            <input
              type="date"
              name="start_date"
              value={newEvent.start_date}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-field">
            <label>Fecha de Fin</label>
            <input
              type="date"
              name="end_date"
              value={newEvent.end_date}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-field">
            <label>Número Máximo de Stands</label>
            <input
              type="number"
              name="max_stands"
              value={newEvent.max_stands}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-field full-width">
            <label>Descripción</label>
            <textarea
              name="description"
              value={newEvent.description}
              onChange={handleInputChange}
              rows="4"
            ></textarea>
          </div>
          <div className="form-field full-width">
            <label>Imagen</label>
            <input type="file" onChange={handleImageChange} />
          </div>
          <button type="submit" className="form-button">
            Crear Evento
          </button>
        </form>

        <h2 className="section-title">Listado de Eventos</h2>
        <div className="events-grid">
          {events.map((event) => (
            <div key={event.id} className="event-card-list">
              {event.image && <img src={event.image} alt="Event" className="event-image" />}
              <h3 className="event-name">{event.name}</h3>
              <p className="event-date">
                {event.start_date} - {event.end_date}
              </p>
              <p className="event-description">{event.description}</p>
              <p>
                <strong>Máx. Stands:</strong> {event.max_stands}
              </p>
              <div className="event-actions">
                <button
                  onClick={() => navigate(`/admin/events/edit/${event.id}`)}
                  className="edit-button"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(event.id)}
                  className="delete-button"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminEventsPage;
