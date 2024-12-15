import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminEventsPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ name: '', start_date: '', end_date: '', description: '', image: '' });
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
        toast.error('Error al cargar eventos.');
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
    const endpoint = editingEvent ? `/events/${editingEvent.id}/update/` : '/events/create/';
    const method = editingEvent ? 'put' : 'post';

    try {
      const response = await api({
        method: method,
        url: endpoint,
        data: newEvent,
      });

      if (editingEvent) {
        setEvents((prevEvents) =>
          prevEvents.map((event) => (event.id === editingEvent.id ? response.data : event))
        );
        toast.success('Evento actualizado con éxito.');
      } else {
        setEvents((prevEvents) => [...prevEvents, response.data]);
        toast.success('Evento creado con éxito.');
      }

      setNewEvent({ name: '', start_date: '', end_date: '', description: '', image: '' });
      setEditingEvent(null);
    } catch (error) {
      console.error('Error al guardar el evento:', error);
      toast.error(error.response?.data?.detail || 'Error al guardar el evento.');
    }
  };

  const handleEdit = (event) => {
    setNewEvent(event);
    setEditingEvent(event);
  };

  const handleDelete = async (eventId) => {
    try {
      await api.delete(`/events/${eventId}/delete/`);
      setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));
      toast.success('Evento eliminado con éxito.');
    } catch (error) {
      console.error('Error al eliminar el evento:', error);
      toast.error(error.response?.data?.detail || 'Error al eliminar el evento.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-gray-800 p-6 rounded-lg shadow-lg text-gray-100">
        <h1 className="text-3xl font-bold mb-6 text-[#C7AA68] text-center">Gestión de Eventos</h1>

        <form onSubmit={handleEventSubmit} className="space-y-4">
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
              accept="image/*" // Solo permite imágenes
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
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
};

export default AdminEventsPage;
