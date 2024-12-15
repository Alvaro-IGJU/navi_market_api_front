import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const AdminEventsPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ name: '', start_date: '', end_date: '', description: '', image: '' });
  const [message, setMessage] = useState('');
  const [editingEvent, setEditingEvent] = useState(null);

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
      reader.readAsDataURL(file); // Convierte la imagen a base64
    }
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    const endpoint = editingEvent ? `/events/${editingEvent.id}/update/` : '/events/create/';
    const method = editingEvent ? 'put' : 'post';

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('No estás autenticado.');

      const response = await api({
        method: method,
        url: endpoint,
        data: newEvent,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (editingEvent) {
        setEvents((prevEvents) =>
          prevEvents.map((event) => (event.id === editingEvent.id ? response.data : event))
        );
        setMessage('Evento actualizado con éxito.');
      } else {
        setEvents((prevEvents) => [...prevEvents, response.data]);
        setMessage('Evento creado con éxito.');
      }

      setNewEvent({ name: '', start_date: '', end_date: '', description: '', image: '' });
      setEditingEvent(null);
    } catch (error) {
      console.error('Error al guardar el evento:', error);
      setMessage(error.response?.data?.detail || 'Error al guardar el evento.');
    }
  };

  const handleEdit = (event) => {
    setNewEvent(event);
    setEditingEvent(event);
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
    <div className="bg-gray-900 min-h-screen text-gray-100">
      <div className="max-w-4xl mx-auto p-6 bg-gray-800 rounded-lg shadow-lg mt-4">
        <h1 className="text-3xl font-bold mb-6 text-[#C7AA68]">Gestión de Eventos</h1>
        {message && <p className="text-red-500">{message}</p>}

        <form onSubmit={handleEventSubmit} className="mb-4">
          <div>
            <label className="block text-gray-200">Nombre del Evento</label>
            <input
              type="text"
              name="name"
              value={newEvent.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-gray-700 text-gray-100 border border-gray-600 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-200">Fecha de Inicio</label>
            <input
              type="date"
              name="start_date"
              value={newEvent.start_date}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-gray-700 text-gray-100 border border-gray-600 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-200">Fecha de Fin</label>
            <input
              type="date"
              name="end_date"
              value={newEvent.end_date}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-gray-700 text-gray-100 border border-gray-600 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-200">Descripción</label>
            <textarea
              name="description"
              value={newEvent.description}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-gray-700 text-gray-100 border border-gray-600 rounded"
              rows="4"
            ></textarea>
          </div>
          <div>
            <label className="block text-gray-200">Imagen</label>
            <input
              type="file"
              onChange={handleImageChange}
              className="w-full px-4 py-2 bg-gray-700 text-gray-100 border border-gray-600 rounded"
            />
          </div>
          <button
            type="submit"
            className="w-full mt-2 bg-[#C7AA68] text-gray-900 py-2 rounded hover:bg-[#9E8A52] transition duration-300"
          >
            {editingEvent ? 'Actualizar Evento' : 'Crear Evento'}
          </button>
        </form>

        <ul>
          {events.map((event) => (
            <li key={event.id} className="bg-gray-700 p-4 mb-2 rounded">
              <strong>{event.name}</strong> ({event.start_date} - {event.end_date})
              <p>{event.description}</p>
              {event.image && (
                <img src={event.image} alt="Event" className="w-full h-auto rounded" />
              )}
              <button
                onClick={() => handleEdit(event)}
                className="bg-blue-500 text-gray-100 px-4 py-1 rounded mt-2 mr-2"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(event.id)}
                className="bg-red-500 text-gray-100 px-4 py-1 rounded mt-2"
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminEventsPage;