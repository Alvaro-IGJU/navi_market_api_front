import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';
import '../adminEditEventPage.css';

const EditEventPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!user?.is_superuser) {
      navigate('/');
      return;
    }

    const fetchEvent = async () => {
      try {
        const response = await api.get(`/events/${eventId}/`);
        setEvent(response.data.event); // Carga el evento completo
      } catch (error) {
        console.error('Error al cargar el evento:', error);
        setMessage('Error al cargar el evento.');
      }
    };

    fetchEvent();
  }, [user, navigate, eventId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEvent((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setEvent((prevData) => ({ ...prevData, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('No estás autenticado.');

      await api.put(`/events/${eventId}/update/`, event, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      setMessage('Evento actualizado con éxito.');
      navigate('/admin/events');
    } catch (error) {
      console.error('Error al actualizar el evento:', error);
      setMessage(error.response?.data?.detail || 'Error al actualizar el evento.');
    }
  };

  if (!event) return <p>Cargando evento...</p>;

  return (
    <div className="edit-event-page">
      <div className="edit-event-container">
        <h1 className="edit-event-title">Editar Evento</h1>
        {message && <p className="message">{message}</p>}
        <form onSubmit={handleUpdate} className="edit-event-form-grid">
          <div className="edit-event-form-field">
            <label className="edit-event-label">Nombre del Evento</label>
            <input
              type="text"
              name="name"
              className="edit-event-input"
              value={event.name || ''}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="edit-event-form-field">
            <label className="edit-event-label">Fecha de Inicio</label>
            <input
              type="date"
              name="start_date"
              value={event.start_date || ''}
              className="edit-event-input"
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="edit-event-form-field">
            <label className="edit-event-label">Fecha de Fin</label>
            <input
              type="date"
              name="end_date"
              className="edit-event-input"
              value={event.end_date || ''}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="edit-event-form-field">
            <label className="edit-event-label">Número Máximo de Stands</label>
            <input
              type="number"
              name="max_stands"
              value={event.max_stands || ''}
              onChange={handleInputChange}
              className="edit-event-input"
              required
            />
          </div>
          <div className="edit-event-form-field">
            <label className="edit-event-label">Descripción</label>
            <textarea
              name="description"
              className="edit-event-textarea"
              value={event.description || ''}
              onChange={handleInputChange}
              rows="4"
            ></textarea>
          </div>
          <div className="edit-event-image-field">
            <label className="edit-event-label">Imagen Actual</label>
            {event.image && (
              <img
                src={event.image}
                alt="Evento"
                className="current-image"
              />
            )}
            <label className="edit-event-label">Subir Nueva Imagen</label>
            <input type="file" onChange={handleImageChange} />
          </div>
          <div className="edit-event-buttons">
            <button type="submit" className="edit-event-button">
              Actualizar Evento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEventPage;
